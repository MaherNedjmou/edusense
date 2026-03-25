# -*- coding: utf-8 -*-
import io
import numpy as np
import cv2
import onnxruntime as ort
import urllib.request
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List

# CONFIG
HF_ONNX_URL = "https://huggingface.co/Achouche/detectron2/resolve/main/detectron2.onnx"
INPUT_H = 800
INPUT_W = 1333
SCORE_THRESH = 0.5

CLASS_NAMES = {0: "text", 1: "title", 2: "table", 3: "list", 4: "figure"}

# LOAD MODEL
print("Loading ONNX model from Hugging Face...")
with urllib.request.urlopen(HF_ONNX_URL) as f:
    model_bytes = f.read()
session = ort.InferenceSession(io.BytesIO(model_bytes).read(), providers=["CPUExecutionProvider"])
print("ONNX model loaded successfully!")

# RESPONSE SCHEMA
class BoundingBox(BaseModel):
    type: str
    bbox: List[int]  # [x1, y1, x2, y2]
    score: float

class DetectionResponse(BaseModel):
    count: int
    detections: List[BoundingBox]

# HELPERS
def decode_image(raw: bytes) -> np.ndarray:
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode the uploaded image.")
    return img

# def run_inference(image: np.ndarray) -> list:
#     orig_h, orig_w = image.shape[:2]
#     img = cv2.resize(image, (INPUT_W, INPUT_H))
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
#     img = img.transpose(2, 0, 1)  # HWC -> CHW
#     img = np.expand_dims(img, axis=0)  # batch

#     # build inputs
#     inputs = {session.get_inputs()[0].name: img}
#     outputs = session.run(None, inputs)
#     raw_boxes, raw_scores, raw_classes = outputs[:3]

#     # rescale boxes
#     scale_x, scale_y = orig_w / INPUT_W, orig_h / INPUT_H
#     results = []
#     for box, score, cls in zip(raw_boxes, raw_scores, raw_classes):
#         if score < SCORE_THRESH:
#             continue
#         x1, y1, x2, y2 = box
#         results.append({
#             "type": CLASS_NAMES.get(int(cls), str(int(cls))),
#             "bbox": [int(x1*scale_x), int(y1*scale_y), int(x2*scale_x), int(y2*scale_y)],
#             "score": float(score)
#         })
#     return results


def run_inference(image: np.ndarray) -> list:
    orig_h, orig_w = image.shape[:2]

    # 1. Resize + RGB
    img = cv2.resize(image, (INPUT_W, INPUT_H))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
    img = img.transpose(2, 0, 1)  # HWC -> CHW

    # 2. Build inputs
    inputs = {session.get_inputs()[0].name: img}  # لا تضيف batch

    # 3. Inference
    outputs = session.run(None, inputs)
    raw_boxes, raw_scores, raw_classes = outputs[:3]

    # 4. Rescale
    scale_x, scale_y = orig_w / INPUT_W, orig_h / INPUT_H
    results = []
    for box, score, cls in zip(raw_boxes, raw_scores, raw_classes):
        if score < SCORE_THRESH:
            continue
        x1, y1, x2, y2 = box
        results.append({
            "type": CLASS_NAMES.get(int(cls), str(int(cls))),
            "bbox": [int(x1*scale_x), int(y1*scale_y), int(x2*scale_x), int(y2*scale_y)],
            "score": float(score)
        })
    return results


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
        detections = run_inference(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {e}")
    return DetectionResponse(count=len(detections), detections=detections)
