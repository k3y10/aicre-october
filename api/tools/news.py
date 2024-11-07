import os
import json
import requests
from bs4 import BeautifulSoup
import logging

# Logging configuration
logging.basicConfig(
    filename='scrape.log',
    filemode='a',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Define the data directory path for saving JSON files
DATA_DIR = os.path.join(os.path.dirname(__file__), '../data')

# Ensure the data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def save_news_to_file(filename, data):
    """Save news data to a JSON file in the data directory."""
    try:
        file_path = os.path.join(DATA_DIR, filename)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        logging.info(f"Data saved to {filename}")
        return True
    except Exception as e:
        logging.error(f"Error saving news data to {filename}: {e}")
        return False

# Function to scrape Google News
def scrape_google_news(search_query):
    try:
        logging.info(f"Starting scrape for: {search_query}")
        
        # Construct Google News search URL
        search_url = f"https://news.google.com/search?q={search_query.replace(' ', '%20')}&hl=en-US&gl=US&ceid=US:en"
        
        # Send a GET request to Google News
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(search_url, headers=headers)
        
        if response.status_code != 200:
            logging.error(f"Failed to fetch data from Google News. Status code: {response.status_code}")
            return {"error": f"Failed to fetch data from Google News. Status code: {response.status_code}"}
        
        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Scrape headlines and URLs
        headlines = []
        for result in soup.select('article'):
            title_elem = result.find('h3')
            link_elem = result.find('a', href=True)
            if title_elem and link_elem:
                title = title_elem.get_text()
                url = "https://news.google.com" + link_elem['href'][1:]  # Convert relative URL to absolute
                headlines.append({'title': title, 'url': url})

        logging.info(f"Found {len(headlines)} headlines for {search_query}.")
        return {'articles': headlines}

    except Exception as e:
        logging.error(f"Error while scraping {search_query}: {e}")
        return {"error": str(e)}

# Convenience functions for each type of news
def get_national_news():
    news_data = scrape_google_news("National Commercial Real Estate News")
    save_news_to_file('national_news.json', news_data)
    return news_data

def get_regional_news():
    news_data = scrape_google_news("Regional Commercial Real Estate News")
    save_news_to_file('regional_news.json', news_data)
    return news_data

def get_emerging_news():
    news_data = scrape_google_news("Emerging Commercial Real Estate News")
    save_news_to_file('emerging_news.json', news_data)
    return news_data
