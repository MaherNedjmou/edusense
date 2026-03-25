import io
import numpy as np
import cv2
import onnxruntime as ort
import urllib.request

# CONFIG
HF_ONNX_URL = "https://huggingface.co/Achouche/detectron2/resolve/main/detectron2.onnx"
INPUT_H = 800
INPUT_W = 1333
SCORE_THRESH = 0.5
CLASS_NAMES = {0: "text", 1: "title", 2: "table", 3: "list", 4: "figure"}

session = None

def load_model():
    """Loads the ONNX model into the global session."""
    global session
    if session is None:
        print("Loading ONNX model from Hugging Face...")
        with urllib.request.urlopen(HF_ONNX_URL) as f:
            model_bytes = f.read()
        session = ort.InferenceSession(io.BytesIO(model_bytes).read(), providers=["CPUExecutionProvider"])
        print("ONNX model loaded successfully!")

def run_inference(image: np.ndarray) -> list:
    """Runs inference using the loaded ONNX model."""
    if session is None:
        load_model()
        
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
