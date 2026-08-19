from pathlib import Path
import csv
from ultralytics import YOLO


# --------------------------------------------------
# PATHS
# --------------------------------------------------

MODEL_PATH = Path(
    r"E:\heritagegaurd-ai\runs\detect\runs\heritage_crack_fast\weights\best.pt"
)

TEST_DIR = Path(
    "data/raw/Second_Dataset/Crack_Data_Darbhanga/test"
)

OUTPUT_FILE = Path(
    "data/processed/crack_features.csv"
)


# --------------------------------------------------
# LOAD MODEL
# --------------------------------------------------

print("Loading HeritageGuard crack detector...")

model = YOLO(str(MODEL_PATH))

print("Model loaded successfully!")


# --------------------------------------------------
# CREATE OUTPUT DIRECTORY
# --------------------------------------------------

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)


# --------------------------------------------------
# PROCESS IMAGES
# --------------------------------------------------

rows = []

image_files = [
    p for p in TEST_DIR.iterdir()
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
]

print(f"Found {len(image_files)} test images.")

for index, image_path in enumerate(image_files, start=1):

    print(
        f"Processing {index}/{len(image_files)}: "
        f"{image_path.name}"
    )

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
    crack_area = 0.0

    if result.boxes is not None:

        boxes = result.boxes

        crack_count = len(boxes)

        for box in boxes:

            confidence = float(box.conf[0])

            total_confidence += confidence

            max_confidence = max(
                max_confidence,
                confidence
            )

            # Bounding box coordinates
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            box_area = max(0, x2 - x1) * max(0, y2 - y1)

            image_height, image_width = result.orig_shape

            image_area = image_width * image_height

            if image_area > 0:
                crack_area += box_area / image_area

    average_confidence = (
        total_confidence / crack_count
        if crack_count > 0
        else 0.0
    )

    rows.append(
        {
            "image": image_path.name,
            "crack_count": crack_count,
            "crack_area_ratio": round(crack_area, 6),
            "average_confidence": round(
                average_confidence,
                4
            ),
            "max_confidence": round(
                max_confidence,
                4
            )
        }
    )


# --------------------------------------------------
# SAVE FEATURES
# --------------------------------------------------

with open(
    OUTPUT_FILE,
    "w",
    newline="",
    encoding="utf-8"
) as file:

    fieldnames = [
        "image",
        "crack_count",
        "crack_area_ratio",
        "average_confidence",
        "max_confidence"
    ]

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()

    writer.writerows(rows)


print("\n========================================")
print("CRACK FEATURE EXTRACTION COMPLETE")
print("========================================")
print(f"Images processed : {len(rows)}")
print(f"Output file      : {OUTPUT_FILE}")
print("========================================")