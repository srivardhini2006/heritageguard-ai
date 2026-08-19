from pathlib import Path
import cv2

DATASET = Path(
    "data/raw/Second_Dataset/Crack_Data_Darbhanga"
)

IMAGE_DIR = DATASET / "train" / "images"
LABEL_DIR = DATASET / "train" / "labels"

# Get first 5 images
images = list(IMAGE_DIR.glob("*.jpg"))[:5]

for image_path in images:

    label_path = LABEL_DIR / f"{image_path.stem}.txt"

    image = cv2.imread(str(image_path))

    if image is None:
        print("Could not read:", image_path)
        continue

    height, width = image.shape[:2]

    if label_path.exists():

        with open(label_path, "r") as file:

            for line in file:

                values = line.strip().split()

                if len(values) != 5:
                    continue

                class_id, x_center, y_center, box_width, box_height = map(
                    float, values
                )

                # Convert normalized YOLO coordinates
                x_center *= width
                y_center *= height
                box_width *= width
                box_height *= height

                x1 = int(x_center - box_width / 2)
                y1 = int(y_center - box_height / 2)

                x2 = int(x_center + box_width / 2)
                y2 = int(y_center + box_height / 2)

                cv2.rectangle(
                    image,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    image,
                    "crack",
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 0),
                    2
                )

    output_path = Path("data/processed") / f"labeled_{image_path.name}"

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    cv2.imwrite(str(output_path), image)

    print("Saved:", output_path)