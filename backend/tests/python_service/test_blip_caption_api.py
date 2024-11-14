import pytest
from unittest.mock import Mock, patch
from io import BytesIO
from PIL import Image
from python_service.blip_caption_api import app  # Import app from the python_service directory

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_caption_image_valid_url(client, mocker):
    # Create a simple valid image
    img = Image.new('RGB', (10, 10))
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)  # Reset the pointer to the start of the BytesIO object
<<<<<<< HEAD
=======
    
>>>>>>> eb9a2d3d5c0625bcff54ec8dbece882d940c9352
    # Mock external requests and image processing
    mocker.patch("python_service.blip_caption_api.requests.get", return_value=Mock(raw=img_bytes))
    mocker.patch("python_service.blip_caption_api.processor.decode", return_value="A sample caption")
    mocker.patch("python_service.blip_caption_api.model.generate", return_value=["mocked tensor output"])

    response = client.post('/caption', json={'imageUrl': 'http://example.com/sample.jpg'})
    
    assert response.status_code == 200
    assert response.json == {"caption": "A sample caption"}

def test_caption_image_missing_url(client):
    response = client.post('/caption', json={})
    
    assert response.status_code == 400
    assert response.json == {"error": "Image URL is required"}

def test_caption_image_processing_error(client, mocker):
    # Simulate an error in the image loading process
    mocker.patch("python_service.blip_caption_api.requests.get", side_effect=Exception("Image loading failed"))

    response = client.post('/caption', json={'imageUrl': 'http://example.com/sample.jpg'})
    
    assert response.status_code == 500
    assert "error" in response.json