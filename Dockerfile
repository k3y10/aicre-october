# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies and SpaCy model
RUN pip install --no-cache-dir -r requirements.txt && \
    python -m spacy download en_core_web_sm

# Make port 5328 available to the world outside this container
EXPOSE 5328

# Run the application
CMD ["python", "api/index.py"]
