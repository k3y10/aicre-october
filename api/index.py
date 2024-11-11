import os
import sys
import base64
import json
import requests
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from firebase_admin import credentials, initialize_app, firestore, storage
import openai
import threading
import csv
from io import BytesIO
import datetime
import pandas as pd

# Append the correct system path for module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import custom scraping logic
from api.tools.census import get_census_data
from api.tools.extract_property_data import extract_data_from_pdf
from api.tools.news import get_national_news, get_regional_news, get_emerging_news
from api.tools.zillow import scrape_zillow_data
from api.tools.rates import fetch_interest_rates  # Import the rates function


# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["https://getaicre.com", "https://aicre.io", "http://localhost:3000"]}})

# Firebase setup
firebase_service_account_key_base64 = os.getenv('NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY')
if not firebase_service_account_key_base64:
    raise ValueError("Missing Firebase service account key environment variable")

firebase_service_account_key_bytes = base64.b64decode(firebase_service_account_key_base64)
firebase_service_account_key_str = firebase_service_account_key_bytes.decode('utf-8')

try:
    firebase_service_account_key_dict = json.loads(firebase_service_account_key_str)
    cred = credentials.Certificate(firebase_service_account_key_dict)
    firebase_app = initialize_app(cred, {
        'databaseURL': 'https://aicre-5b66a-default-rtdb.firebaseio.com/',
        'storageBucket': 'aicre-5b66a.appspot.com'
    })
    bucket = storage.bucket(app=firebase_app)  # Initialize Firebase Storage bucket
except json.JSONDecodeError as e:
    raise ValueError(f"JSON Decode Error: {e}")
except Exception as e:
    raise ValueError(f"Firebase Initialization Error: {e}")

# Firestore client setup
db = firestore.client(firebase_app)

# OpenAI GPT-4 setup
openai.api_key = os.getenv('NEXT_PUBLIC_OPEN_API_KEY')

def analyze_document_with_gpt4(document_text):
    """Calls OpenAI GPT-4 to analyze and extract information from a document."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that extracts relevant data from commercial real estate documents."},
                {"role": "user", "content": f"Extract all important data from this document:\n{document_text}"}
            ],
            max_tokens=1500
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return str(e)

@app.route('/api/rates', methods=['GET'])
def get_interest_rates():
    try:
        rates_data = fetch_interest_rates()
        if "error" in rates_data:
            return jsonify(rates_data), 500
        return jsonify(rates_data), 200
    except Exception as e:
        logging.error(f"General error in rates endpoint: {e}")
        return jsonify({'error': 'Failed to fetch rates', 'message': str(e)}), 500

# Consolidated route for uploading and processing documents with GPT-4 and extracting property data
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join('/tmp', filename)
        file.save(file_path)

        # Assuming text-based files (CSV, JSON, or plain text) for GPT-4 analysis
        with open(file_path, 'r') as f:
            document_text = f.read()

        # Call GPT-4 for document analysis
        gpt_extracted_info = analyze_document_with_gpt4(document_text)

        # Call the extraction function for property data
        property_extracted_info = extract_data_from_pdf(file_path)

        # Store the extracted info in Firebase Firestore
        doc_ref = db.collection('documents').add({
            'filename': filename,
            'gpt_extracted_info': gpt_extracted_info,
            'property_extracted_info': json.loads(property_extracted_info),
            'timestamp': datetime.datetime.utcnow()
        })

        # Store the file in Firebase Storage
        blob = bucket.blob(f"documents/{filename}")
        blob.upload_from_filename(file_path)
        file_url = blob.public_url

        # Return extracted info and file URL
        return jsonify({
            'gpt_details': gpt_extracted_info,
            'property_details': json.loads(property_extracted_info),
            'file_url': file_url
        }), 200

    return jsonify({'error': 'File processing failed'}), 500

# Endpoint for Zillow Data
@app.route('/api/zillow', methods=['GET'])
def zillow_data():
    user_input = request.args.get('address')
    if not user_input:
        return jsonify({'error': 'Address is required'}), 400


# Route for getting Census data
@app.route('/census', methods=['GET'])
def census_data():
    region = request.args.get('region')
    if not region:
        return jsonify({'error': 'Region is required'}), 400
    data = get_census_data(region)
    return jsonify(data)

# Endpoint for National News
@app.route('/api/news/national', methods=['GET'])
def national_news():
    news_data = get_national_news()
    return jsonify(news_data)

# Endpoint for Regional News
@app.route('/api/news/regional', methods=['GET'])
def regional_news():
    news_data = get_regional_news()
    return jsonify(news_data)

# Endpoint for Emerging News
@app.route('/api/news/emerging', methods=['GET'])
def emerging_news():
    news_data = get_emerging_news()
    return jsonify(news_data)

# Main entry point for running the Flask app on the specified port and host
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5328)
