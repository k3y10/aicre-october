import os
import json
import requests
from bs4 import BeautifulSoup
import logging

# Logging configuration
logging.basicConfig(
    filename='rates_scrape.log',
    filemode='a',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Define the data directory path for saving JSON files
DATA_DIR = os.path.join(os.path.dirname(__file__), '../data')

# Ensure the data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def save_rates_to_file(filename, data):
    """Save rate data to a JSON file in the data directory."""
    try:
        file_path = os.path.join(DATA_DIR, filename)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        logging.info(f"Data saved to {filename}")
        return True
    except Exception as e:
        logging.error(f"Error saving rate data to {filename}: {e}")
        return False

def fetch_interest_rates():
    """Scrapes key market index rates from the target page."""
    url = "https://www.commercialloandirect.com/commercial-rates.php"
    rates = []

    try:
        logging.info(f"Starting scrape for: {url}")
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        
        if response.status_code != 200:
            logging.error(f"Failed to fetch data from {url}. Status code: {response.status_code}")
            return {"error": f"Failed to fetch data. Status code: {response.status_code}"}
        
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the section with Key Market Index Rates
        section = soup.find('h2', {'id': 'keymarketinterestrates'})
        if section:
            table = section.find_next('table')
            if table:
                rows = table.find_all('tr')
                for row in rows[1:]:  # Skip the header row
                    columns = row.find_all('td')
                    if len(columns) >= 2:
                        index = columns[0].get_text(strip=True)
                        rate = columns[1].get_text(strip=True)
                        rates.append({"index": index, "rate": rate})
        
        if rates:
            logging.info(f"Extracted {len(rates)} rates from {url}")
        else:
            logging.warning("No rates found.")

    except Exception as e:
        logging.error(f"Error scraping {url}: {e}")
        return {"error": str(e)}

    # Save the rates to a JSON file
    save_rates_to_file('key_market_rates.json', rates)
    
    return {"rates": rates}

# Uncomment to test standalone
# if __name__ == "__main__":
#     rates = fetch_interest_rates()
#     print(json.dumps(rates, indent=4))
