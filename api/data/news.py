# scraper.py
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
    return scrape_google_news("National Commercial Real Estate News")

def get_regional_news():
    return scrape_google_news("Regional Commercial Real Estate News")

def get_emerging_news():
    return scrape_google_news("Emerging Commercial Real Estate News")
