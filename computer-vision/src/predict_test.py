from pathlib import Path
from ultralytics import YOLO

# Trained model
MODEL_PATH = (
    r"E:\heritagegaurd-ai\runs\detect\runs\heritage_crack_fast\weights\best.pt"
)
# Test images
TEST_DIR = Path(
    "data/raw/Second_Dataset/Crack_Data_Darbhanga/test"
)

# Where predictions will be saved
OUTPUT_DIR = Path("runs/predictions")

# Load model
model = YOLO(MODEL_PATH)

# Run prediction
results = model.predict(
    source=str(TEST_DIR),
    conf=0.25,
    imgsz=320,
    save=True,
    project=str(OUTPUT_DIR.parent),
    name=OUTPUT_DIR.name,
)

print("Prediction completed!")
print(f"Results saved in: {OUTPUT_DIR}")