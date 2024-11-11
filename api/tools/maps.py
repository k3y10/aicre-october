import os
import requests
from flask import jsonify, request

def mapbox_search(query):
    """Function to call Mapbox Search API."""
    if not query:
        return {'error': "Missing query parameter 'q'"}, 400

    access_token = os.getenv('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN')
    if not access_token:
        return {'error': "Mapbox access token is not set"}, 500

    mapbox_url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={access_token}&limit=5"

    try:
        response = requests.get(mapbox_url)
        response.raise_for_status()
        return response.json(), 200
    except requests.exceptions.HTTPError as http_err:
        return {'error': f"HTTP error occurred: {http_err}"}, 500
    except requests.exceptions.RequestException as req_err:
        return {'error': f"Request error: {req_err}"}, 500
