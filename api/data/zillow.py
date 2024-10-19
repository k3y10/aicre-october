import os
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), 'saved_data.json')

def scrape_zillow_data(address):
    # Initialize Selenium WebDriver with headless Chrome for efficiency
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode (no UI)
    options.add_argument('--disable-gpu')  # Disable GPU rendering
    options.add_argument('--no-sandbox')  # Bypass OS security model

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # Format the address for Zillow URL
        formatted_address = address.replace(' ', '-')
        zillow_url = f'https://www.zillow.com/homes/{formatted_address}_rb/'

        driver.get(zillow_url)

        # Wait for page load and check if the key elements are available
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ds-summary-row")))

        # Parse the page using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scrape commercial property data
        price = soup.select_one('.ds-summary-row').text.strip() if soup.select_one('.ds-summary-row') else 'N/A'
        address_details = soup.select_one('.ds-address-container').text.strip() if soup.select_one('.ds-address-container') else 'N/A'
        property_type = soup.select_one('.ds-home-type').text.strip() if soup.select_one('.ds-home-type') else 'N/A'
        property_size = soup.select_one('.ds-home-fact-list-item').text.strip() if soup.select_one('.ds-home-fact-list-item') else 'N/A'

        # Scrape property images
        image_tags = soup.select('.media-stream img')[:5]  # Get up to 5 images
        images = [img['src'] for img in image_tags if img.get('src')]

        # Historical Data URL (Zillow Data Research)
        historical_data_url = get_historical_data_url(address)

        # Save data to JSON
        property_data = {
            'price': price,
            'address': address_details,
            'property_type': property_type,
            'property_size': property_size,
            'images': images,
            'historical_data_url': historical_data_url
        }
        save_to_json(property_data)

        return property_data

    except Exception as e:
        print(f"Error occurred: {e}")
        return {'error': str(e)}

    finally:
        driver.quit()

def save_to_json(data):
    """
    Function to save scraped data into a JSON file.
    It appends the new data to the existing array in 'saved_data.json'.
    """
    try:
        if os.path.exists(DATA_FILE_PATH):
            with open(DATA_FILE_PATH, 'r+') as file:
                # Load existing data
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

    except Exception as e:
        print(f"Error saving to JSON: {e}")

def get_historical_data_url(address):
    """
    Function to construct a URL to Zillow's historical data section.
    The link can be based on region or city.
    """
    base_url = "https://www.zillow.com/research/data/"
    city = address.split(",")[1].strip() if "," in address else "Unknown"
    historical_data_url = f"{base_url}{city.lower().replace(' ', '-')}-real-estate/"
    
    return historical_data_url
