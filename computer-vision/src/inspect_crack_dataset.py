from pathlib import Path
from collections import Counter

DATASET = Path(
    "data/raw/Second_Dataset/Crack_Data_Darbhanga"
)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

print("=" * 60)
print("DARbhanga FORT CRACK DATASET INSPECTION")
print("=" * 60)


def get_images(folder):
    if not folder.exists():
        return []

    return [
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
    ]


def get_labels(folder):
    if not folder.exists():
        return []

    return [
        p for p in folder.glob("*.txt")
        if p.name.lower() != "classes.txt"
    ]


# -------------------------
# TRAIN + VAL
# -------------------------

for split in ["train", "val"]:

    split_path = DATASET / split

    image_path = split_path / "images"
    label_path = split_path / "labels"

    print(f"\n--- {split.upper()} ---")

    images = get_images(image_path)
    labels = get_labels(label_path)

    print("Images :", len(images))
    print("Labels :", len(labels))

    image_names = {p.stem for p in images}
    label_names = {p.stem for p in labels}

    print(
        "Images without labels :",
        len(image_names - label_names)
    )

    print(
        "Labels without images :",
        len(label_names - image_names)
    )

    class_ids = Counter()

    for label_file in labels:

        with open(label_file, "r") as file:

            for line in file:

                values = line.strip().split()

                if len(values) >= 5:
                    class_ids[values[0]] += 1

    print("Class IDs:", dict(class_ids))


# -------------------------
# TEST
# -------------------------

print("\n--- TEST ---")

test_path = DATASET / "test"

test_images = get_images(test_path)

print("Test images :", len(test_images))

print("\n" + "=" * 60)
print("INSPECTION COMPLETE")
print("=" * 60)