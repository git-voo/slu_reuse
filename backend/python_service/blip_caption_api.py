from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
from PIL import Image
import requests
import torch
import os
import traceback

app = Flask(__name__)

# Load the BLIP model and processor for captioning
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Load an image classification model from Hugging Face
classifier = pipeline("image-classification", model="google/vit-base-patch16-224")

# Load YOLOv5 model 
#yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5m')
yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5l', verbose=True)

@app.route('/caption_and_category', methods=['POST'])
def caption_and_category():
    data = request.get_json()
    image_url = data.get('imageUrl')

    if not image_url:
        return jsonify({"error": "Image URL is required"}), 400

    try:
        # Step 1: Load the image from the URL
        image = Image.open(requests.get(image_url, stream=True).raw)
        image = image.convert("RGB")  # Ensure the image is in RGB mode
        image = image.resize((640, 640))  # Resize image to improve YOLO performance

        # Debug step: Check if the image is loaded properly
        #image.show()
        
        # Step 2: Generate a caption using BLIP
        inputs = processor(image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        # Step 3: Generate category using the Hugging Face image classification model
        classification_results = classifier(image)
        category = classification_results[0]['label'] if classification_results else "unknown"

        # Step 4: Use YOLOv5 to detect objects in the image
        results = yolo_model(image, size=640)
        yolo_detections = results.pandas().xyxy[0]  # Get YOLOv5 detection results as DataFrame

        # Debug step: Print YOLOv5 detection results
        print(yolo_detections)
        
        # Filter out low-confidence detections (e.g., confidence >= 0.1)
        confidence_threshold = 0.1
        filtered_detections = yolo_detections[yolo_detections['confidence'] >= confidence_threshold]

        # Extract YOLO detected object labels (in a list) and the most confident label
        yolo_labels = filtered_detections['name'].tolist() if not filtered_detections.empty else []
        most_confident_label = filtered_detections.iloc[0]['name'] if not filtered_detections.empty else category

        # Combine category and YOLO labels
        combined_tags = [category] + yolo_labels

        return jsonify({"name": most_confident_label, "caption": caption, "category": category, "tags": combined_tags})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4301, debug=True)
