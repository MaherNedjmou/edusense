import io
import numpy as np
import cv2
import onnxruntime as ort
import urllib.request
from typing import List, Dict, Any, Tuple

# CONFIG
HF_ONNX_URL = "https://huggingface.co/Achouche/detectron2/resolve/main/detectron2.onnx"
INPUT_H = 800
INPUT_W = 1333
SCORE_THRESH = 0.5
CLASS_NAMES = {0: "text", 1: "title", 2: "table", 3: "list", 4: "figure"}

session = None

def load_model() -> None:
    """Loads the ONNX model for layout detection into the global session."""
    global session
    if session is None:
        print("Loading ONNX model from Hugging Face...")
        with urllib.request.urlopen(HF_ONNX_URL) as f:
            model_bytes = f.read()
        session = ort.InferenceSession(io.BytesIO(model_bytes).read(), providers=["CPUExecutionProvider"])
        print("ONNX model loaded successfully!")

def preprocess_image(image: np.ndarray) -> Tuple[np.ndarray, int, int]:
    """
    Preprocess the input image for the Detectron2 model.
    Resizes the image and rearranges the color channels.
    
    Args:
        image (np.ndarray): Original image from decoding.
        
    Returns:
        Tuple[np.ndarray, int, int]: Preprocessed image tensor, original width, and original height.
    """
    orig_h, orig_w = image.shape[:2]
    img = cv2.resize(image, (INPUT_W, INPUT_H))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
    img = img.transpose(2, 0, 1)  # HWC -> CHW
    return img, orig_w, orig_h

def postprocess_outputs(raw_boxes: np.ndarray, raw_scores: np.ndarray, raw_classes: np.ndarray, 
                        orig_w: int, orig_h: int) -> List[Dict[str, Any]]:
    """
    Postprocess model outputs to map predictions back to the original image dimensions.
    
    Args:
        raw_boxes (np.ndarray): Detected bounding boxes.
        raw_scores (np.ndarray): Confidence scores.
        raw_classes (np.ndarray): Class predictions.
        orig_w (int): Original image width.
        orig_h (int): Original image height.
        
    Returns:
        List[Dict]: List of detected objects with type, bbox, and score.
    """
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

def run_inference(image: np.ndarray) -> List[Dict[str, Any]]:
    """
    Run the full inference pipeline for the Detectron2 model.
    Includes preprocessing, session run, and postprocessing.
    
    Args:
        image (np.ndarray): Input image in BGR format.
        
    Returns:
        List[Dict]: Detected layout elements.
    """
    if session is None:
        load_model()
        
    img, orig_w, orig_h = preprocess_image(image)
    
    inputs = {session.get_inputs()[0].name: img}
    outputs = session.run(None, inputs)
    
    raw_boxes, raw_scores, raw_classes = outputs[:3]
    return postprocess_outputs(raw_boxes, raw_scores, raw_classes, orig_w, orig_h)
