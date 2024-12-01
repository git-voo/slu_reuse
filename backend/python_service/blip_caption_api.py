from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
from PIL import Image
import requests

app = Flask(__name__)

# Load the BLIP model and processor for captioning
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Load an image classification model from Hugging Face
classifier = pipeline("image-classification", model="google/vit-base-patch16-224")

@app.route('/caption_and_category', methods=['POST'])
def caption_and_category():
    data = request.get_json()
    image_url = data.get('imageUrl')

    if not image_url:
        return jsonify({"error": "Image URL is required"}), 400

    try:
        # Load the image from the URL
        image = Image.open(requests.get(image_url, stream=True).raw)

        # Generate a caption using BLIP
        inputs = processor(image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        # Generate category using the image classification model
        image_for_classification = image.convert("RGB")  # Ensure image is in RGB mode
        classification_results = classifier(image_for_classification)
        category = classification_results[0]['label'] if classification_results else "unknown"

        return jsonify({"caption": caption, "category": category, "tags": category})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4301, debug=True)