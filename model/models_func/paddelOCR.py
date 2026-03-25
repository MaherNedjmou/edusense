import io
import onnxruntime as ort
import numpy as np
import cv2
import yaml
import urllib.request

det_session = None
rec_session = None
det_input = None
rec_input = None
chars = []
num_classes = None

DET_URL = "https://huggingface.co/Achouche/detectron2/resolve/main/PP-OCRv5_det_mobile.onnx"
REC_URL = "https://huggingface.co/Achouche/detectron2/resolve/main/PP-OCRv5_rec_mobile.onnx"
YML_PATH = r"C:\aboutMe\M2\START-UP\edusense\model\configs\inference.yml"

def load_paddle_models():
    global det_session, rec_session, det_input, rec_input, chars, num_classes
    if det_session is None:
        print("Loading PaddleOCR Det model from Hugging Face...")
        try:
            with urllib.request.urlopen(DET_URL) as f:
                det_bytes = f.read()
            det_session = ort.InferenceSession(io.BytesIO(det_bytes).read(), providers=['CPUExecutionProvider'])
            det_input = det_session.get_inputs()[0].name
            print("PaddleOCR Det model loaded successfully!")
        except Exception as e:
            print(f"Error loading PaddleOCR Det model: {e}")

    if rec_session is None:
        print("Loading PaddleOCR Rec model from Hugging Face...")
        try:
            with urllib.request.urlopen(REC_URL) as f:
                rec_bytes = f.read()
            rec_session = ort.InferenceSession(io.BytesIO(rec_bytes).read(), providers=['CPUExecutionProvider'])
            rec_input = rec_session.get_inputs()[0].name
            print("PaddleOCR Rec model loaded successfully!")
        except Exception as e:
            print(f"Error loading PaddleOCR Rec model: {e}")

    if not chars:
        print("Loading PaddleOCR dictionary...")
        try:
            with open(YML_PATH, 'r', encoding='utf-8') as f:
                cfg = yaml.safe_load(f)

            chars = cfg['PostProcess']['character_dict']
            
            # fix mismatch
            if rec_session is not None:
                num_classes = rec_session.get_outputs()[0].shape[-1]
                chars = [''] + chars
                while len(chars) < num_classes:
                    chars.append('')
            print("PaddleOCR dictionary loaded successfully!")
        except Exception as e:
            print(f"Error loading PaddleOCR dictionary: {e}")

# ================= DETECTION =================
def detect_text_boxes(img):
    h, w = img.shape[:2]

    # resize
    scale = 960 / max(h, w)
    nh, nw = int(h * scale), int(w * scale)
    nh = (nh // 32) * 32
    nw = (nw // 32) * 32

    resized = cv2.resize(img, (nw, nh))

    x = resized.astype(np.float32) / 255.0
    x = np.transpose(x, (2, 0, 1))
    x = np.expand_dims(x, axis=0)

    pred = det_session.run(None, {det_input: x})[0][0, 0]

    # ===== DB-like postprocess =====
    thresh = 0.3
    binary = (pred > thresh).astype(np.uint8) * 255

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 3))
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    boxes = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 300:
            continue

        rect = cv2.minAreaRect(cnt)
        box = cv2.boxPoints(rect)
        box = np.int32(box)

        w_box, h_box = rect[1]
        if min(w_box, h_box) < 10:
            continue

        # scale back
        box[:, 0] = box[:, 0] * w / nw
        box[:, 1] = box[:, 1] * h / nh

        boxes.append(box)

    # sort top to bottom
    boxes = sorted(boxes, key=lambda b: np.mean(b[:, 1]))

    # ===== merge lines =====
    merged = []
    for box in boxes:
        if not merged:
            merged.append(box)
            continue

        prev = merged[-1]
        y_diff = abs(np.mean(box[:, 1]) - np.mean(prev[:, 1]))

        if y_diff < 15:  # same line
            x1 = min(prev[:, 0].min(), box[:, 0].min())
            y1 = min(prev[:, 1].min(), box[:, 1].min())
            x2 = max(prev[:, 0].max(), box[:, 0].max())
            y2 = max(prev[:, 1].max(), box[:, 1].max())

            merged[-1] = np.array([
                [x1, y1],
                [x2, y1],
                [x2, y2],
                [x1, y2]
            ])
        else:
            merged.append(box)

    return merged

# ================= CROP =================
def crop_box(img, box):
    rect = cv2.minAreaRect(box.astype(np.float32))
    w, h = int(rect[1][0]), int(rect[1][1])

    if w <= 0 or h <= 0:
        return None

    src_pts = box.astype("float32")
    dst_pts = np.array([[0, h], [0, 0], [w, 0], [w, h]], dtype="float32")

    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(img, M, (w, h))

    if h > w:
        warped = cv2.rotate(warped, cv2.ROTATE_90_CLOCKWISE)

    return warped

# ================= RECOGNITION =================
def preprocess_rec(img, size=(320, 48)):
    h, w = img.shape[:2]

    scale = min(size[0]/w, size[1]/h)
    nw, nh = int(w * scale), int(h * scale)

    img = cv2.resize(img, (nw, nh))

    canvas = np.ones((size[1], size[0], 3), dtype=np.uint8) * 255
    canvas[:nh, :nw] = img

    x = canvas.astype(np.float32) / 255.0
    x = np.transpose(x, (2, 0, 1))
    x = np.expand_dims(x, axis=0)

    return x

def decode(pred):
    """
    CTC decoding for PP-OCRv5 recognition output.
    Automatically handles repeated chars and blanks.
    """
    pred = np.argmax(pred, axis=2)[0]

    res = []
    prev = -1
    for p in pred:
        if p != prev and p != 0:  # 0 is blank
            if p < len(chars):
                res.append(chars[p])
        prev = p
    return "".join(res)

# ================= OCR =================
def run_paddle_inference(img: np.ndarray) -> list:
    if det_session is None or rec_session is None or not chars:
        load_paddle_models()

    boxes = detect_text_boxes(img)

    results = []
    for box in boxes:
        crop = crop_box(img, box)
        if crop is None:
            continue

        x = preprocess_rec(crop)
        pred = rec_session.run(None, {rec_input: x})[0]

        text = decode(pred)
        if text.strip():
            results.append(text.strip() + " ")

    final_text = "".join(results).strip()
    return [final_text]
