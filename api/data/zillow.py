import os
import json
import logging
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# Define the path for geckodriver
GECKODRIVER_PATH = "/usr/local/bin/geckodriver"
DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), 'saved_data.json')

# Set up logging configuration
logging.basicConfig(
    filename='geckodriver.log',
    filemode='a',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def scrape_zillow_data(user_input):
    """
    This function takes in an address, neighborhood, city, or zip code and scrapes Zillow data.
    """

    # Initialize Selenium WebDriver with headless Firefox for efficiency
    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')  # Run in headless mode

    logging.info(f"Starting scrape for input: {user_input}")

    # Initialize Firefox WebDriver with geckodriver
    driver = webdriver.Firefox(service=Service(GECKODRIVER_PATH), options=options)

    try:
        # Format the input for the Zillow URL based on user input
        formatted_input = user_input.replace(' ', '-')
        zillow_url = f'https://www.zillow.com/homes/{formatted_input}_rb/'

        logging.info(f"Navigating to URL: {zillow_url}")
        driver.get(zillow_url)

        # Wait for page load and check if key elements are available
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ds-summary-row")))

        # Parse the page using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scrape property data
        price = soup.select_one('.ds-summary-row').text.strip() if soup.select_one('.ds-summary-row') else 'N/A'
        address_details = soup.select_one('.ds-address-container').text.strip() if soup.select_one('.ds-address-container') else 'N/A'
        property_type = soup.select_one('.ds-home-type').text.strip() if soup.select_one('.ds-home-type') else 'N/A'
        property_size = soup.select_one('.ds-home-fact-list-item').text.strip() if soup.select_one('.ds-home-fact-list-item') else 'N/A'

        logging.info(f"Scraped data - Price: {price}, Address: {address_details}, Type: {property_type}, Size: {property_size}")

        # Scrape additional property data (optional)
        zestimate = soup.select_one('.ds-estimate-value').text.strip() if soup.select_one('.ds-estimate-value') else 'N/A'
        year_built = soup.select_one('.ds-home-fact-list-item:contains("Year Built")').text.strip() if soup.select_one('.ds-home-fact-list-item:contains("Year Built")') else 'N/A'
        property_taxes = soup.select_one('.ds-home-fact-list-item:contains("Property Tax")').text.strip() if soup.select_one('.ds-home-fact-list-item:contains("Property Tax")') else 'N/A'

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

    finally:
        driver.quit()
        logging.info(f"WebDriver for {user_input} closed")

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
