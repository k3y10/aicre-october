import os
import json
import logging
import requests
from bs4 import BeautifulSoup

# Define the path for saved data
DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), 'saved_data.json')

# Set up logging configuration
logging.basicConfig(
    filename='scrape.log',
    filemode='a',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def scrape_zillow_data(user_input):
    """
    This function takes in an address, neighborhood, city, or zip code and scrapes Zillow data using BeautifulSoup.
    """
    logging.info(f"Starting scrape for input: {user_input}")

    # Format the input for the Zillow URL
    formatted_input = user_input.replace(' ', '-')
    zillow_url = f'https://www.zillow.com/homes/{formatted_input}_rb/'

    try:
        # Send a GET request to Zillow
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(zillow_url, headers=headers)
        
        if response.status_code != 200:
            logging.error(f"Failed to fetch data from Zillow. Status code: {response.status_code}")
            return {"error": f"Failed to fetch data from Zillow. Status code: {response.status_code}"}

        # Parse the page using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Scrape property data
        price = soup.select_one('.ds-summary-row').text.strip() if soup.select_one('.ds-summary-row') else 'N/A'
        address_details = soup.select_one('.ds-address-container').text.strip() if soup.select_one('.ds-address-container') else 'N/A'
        property_type = soup.select_one('.ds-home-type').text.strip() if soup.select_one('.ds-home-type') else 'N/A'
        property_size = soup.select_one('.ds-home-fact-list-item').text.strip() if soup.select_one('.ds-home-fact-list-item') else 'N/A'

        logging.info(f"Scraped data - Price: {price}, Address: {address_details}, Type: {property_type}, Size: {property_size}")

        # Scrape additional property data (optional)
        zestimate = soup.select_one('.ds-estimate-value').text.strip() if soup.select_one('.ds-estimate-value') else 'N/A'
        year_built = next((item.text for item in soup.select('.ds-home-fact-list-item') if 'Year Built' in item.text), 'N/A')
        property_taxes = next((item.text for item in soup.select('.ds-home-fact-list-item') if 'Property Tax' in item.text), 'N/A')

        logging.info(f"Scraped additional data - Zestimate: {zestimate}, Year Built: {year_built}, Taxes: {property_taxes}")

        # Scrape property images
        image_tags = soup.select('.media-stream img')[:5]  # Get up to 5 images
        images = [img['src'] for img in image_tags if img.get('src')]

        logging.info(f"Scraped {len(images)} images")

        # Historical Data URL (Zillow Data Research)
        historical_data_url = get_historical_data_url(user_input)

        # Save data to JSON
        property_data = {
            'price': price,
            'address': address_details,
            'property_type': property_type,
            'property_size': property_size,
            'zestimate': zestimate,
            'year_built': year_built,
            'property_taxes': property_taxes,
            'images': images,
            'historical_data_url': historical_data_url
        }
        save_to_json(property_data)

        logging.info(f"Data saved to JSON for input: {user_input}")
        return property_data

    except Exception as e:
        logging.error(f"Error occurred while scraping {user_input}: {e}")
        return {'error': str(e)}

def save_to_json(data):
    """
    Function to save scraped data into a JSON file.
    It appends the new data to the existing array in 'saved_data.json'.
    """
    try:
        if os.path.exists(DATA_FILE_PATH):
            with open(DATA_FILE_PATH, 'r+') as file:
                try:
                    data_array = json.load(file)
                except json.JSONDecodeError:
                    data_array = []

                # Append new data
                data_array.append(data)

                # Move the file pointer to the beginning of the file to overwrite
                file.seek(0)
                json.dump(data_array, file, indent=4)
        else:
            with open(DATA_FILE_PATH, 'w') as file:
                # Create a new file and write the first entry
                json.dump([data], file, indent=4)

        logging.info("Data successfully saved to JSON")

    except Exception as e:
        logging.error(f"Error saving data to JSON: {e}")

def get_historical_data_url(user_input):
    """
    Function to construct a URL to Zillow's historical data section.
    """
    base_url = "https://www.zillow.com/research/data/"
    city = user_input.split(",")[0].strip()  # Use the first part of the input for city
    historical_data_url = f"{base_url}{city.lower().replace(' ', '-')}-real-estate/"
    
    logging.info(f"Constructed historical data URL: {historical_data_url}")
    
    return historical_data_url
