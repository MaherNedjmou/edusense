# -*- coding: utf-8 -*-
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List

# Import our Detectron2 model functions
from models_func.detectron2 import load_model as load_detectron_model, run_inference as run_detectron_inference
from models_func.paddelOCR import load_paddle_models, run_paddle_inference

# Initialize the models on startup
load_detectron_model()
load_paddle_models()

# RESPONSE SCHEMA
class BoundingBox(BaseModel):
    type: str
    bbox: List[int]  # [x1, y1, x2, y2]
    score: float

class DetectionResponse(BaseModel):
    count: int
    detections: List[BoundingBox]

class OCRResponse(BaseModel):
    texts: List[str]

# HELPERS
def decode_image(raw: bytes) -> np.ndarray:
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode the uploaded image.")
    return img

# FASTAPI
app = FastAPI(title="Simple Layout Detection API", version="1.0.0")

@app.get("/")
def health():
    return {"status": "ok", "model": "Detectron2 ONNX"}

@app.post("/detect", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Upload a JPEG or PNG image.")
    raw = await file.read()
    try:
        image = decode_image(raw)
        detections = run_detectron_inference(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {e}")
    return DetectionResponse(count=len(detections), detections=detections)

@app.post("/ocr", response_model=OCRResponse)
async def ocr(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Upload a JPEG or PNG image.")
    raw = await file.read()
    try:
        image = decode_image(raw)
        texts = run_paddle_inference(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {e}")
    return OCRResponse(texts=texts)
