from ultralytics import YOLO

model = YOLO("yolo11n.pt")

model.train(
    data="data/raw/Second_Dataset/Crack_Data_Darbhanga/data.yaml",
    epochs=2,
    imgsz=320,
    batch=8,
    workers=0,
    fraction=0.15,
    project="runs",
    name="heritage_crack_fast",
)

print("Fast baseline completed!")