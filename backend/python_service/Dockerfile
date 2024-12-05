# Use an official Python runtime as a base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt and install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# Copy the Python service files into the container
COPY . /app/

# Set the entrypoint to run the blip_caption.py file
CMD ["python", "blip_caption_api.py"]
