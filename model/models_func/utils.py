import numpy as np
import cv2

def decode_image(raw: bytes) -> np.ndarray:
    """
    Decodes raw image bytes into an OpenCV BGR numpy array.
    
    Args:
        raw (bytes): Raw bytes of the uploaded image.
        
    Returns:
        np.ndarray: Decoded image.
        
    Raises:
        ValueError: If the image cannot be decoded.
    """
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode the uploaded image.")
    return img
