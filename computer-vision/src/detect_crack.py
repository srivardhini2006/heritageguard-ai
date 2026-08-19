from pathlib import Path
from ultralytics import YOLO


MODEL_PATH = Path(
    r"E:\heritagegaurd-ai\runs\detect\runs\heritage_crack_fast\weights\best.pt"
)


def detect_cracks(image_path):

    model = YOLO(str(MODEL_PATH))

    results = model.predict(
        source=str(image_path),
        conf=0.25,
        imgsz=320,
        verbose=False
    )

    result = results[0]

    crack_count = 0
    total_confidence = 0.0
    max_confidence = 0.0
    crack_area_ratio = 0.0

    if result.boxes is not None:

        boxes = result.boxes
        crack_count = len(boxes)

        image_height, image_width = result.orig_shape
        image_area = image_width * image_height

        for box in boxes:

            confidence = float(box.conf[0])

            total_confidence += confidence
            max_confidence = max(
                max_confidence,
                confidence
            )

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            box_area = max(0, x2 - x1) * max(0, y2 - y1)

            if image_area > 0:
                crack_area_ratio += box_area / image_area

    average_confidence = (
        total_confidence / crack_count
        if crack_count > 0
        else 0.0
    )

    return {
        "crack_count": crack_count,
        "crack_area_ratio": round(crack_area_ratio, 6),
        "average_confidence": round(average_confidence, 4),
        "max_confidence": round(max_confidence, 4)
    }


if __name__ == "__main__":

    image = input("Enter image path: ").strip()

    features = detect_cracks(image)

    print("\n========== CRACK ANALYSIS ==========")
    print(f"Cracks detected       : {features['crack_count']}")
    print(f"Crack area ratio      : {features['crack_area_ratio']}")
    print(f"Average confidence    : {features['average_confidence']}")
    print(f"Maximum confidence    : {features['max_confidence']}")