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
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        logging.info(f"Data saved to {filename}")
        return True
    except Exception as e:
        logging.error(f"Error saving news data to {filename}: {e}")
        return False

def scrape_google_news(search_query):
    """Scrape Google News for commercial real estate articles."""
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
        
        # Extract articles and their attributes
        headlines = []
        articles = soup.find_all('article')
        for article in articles:
            try:
                # Extract the title from an <h3> tag
                title_elem = article.find('h3')
                title = title_elem.get_text(strip=True) if title_elem else "No title available"
                
                # Extract the URL from an anchor tag
                link_elem = article.find('a', href=True)
                url = f"https://news.google.com{link_elem['href'][1:]}" if link_elem else None
                
                # Extract the description from a <span> or <p> tag
                description_elem = article.find('span', class_='xBbh9') or article.find('p')
                description = description_elem.get_text(strip=True) if description_elem else "No description available"
                
                # Extract image source if present
                image_elem = article.find('img', src=True)
                image = image_elem['src'] if image_elem else None
                
                # Extract source (publisher) information
                source_elem = article.find('div', class_='SVJrMe')
                source = source_elem.get_text(strip=True) if source_elem else "Unknown source"
                
                # Append valid articles
                if title and url:
                    headlines.append({
                        'title': title,
                        'text': description,
                        'image': image,
                        'url': url,
                        'source': source
                    })
            except AttributeError as e:
                logging.warning(f"Skipping an article due to missing elements: {e}")
                continue

        # Limit the number of headlines to 3
        headlines = headlines[:3]

        logging.info(f"Found {len(headlines)} headlines for {search_query}.")
        return {'articles': headlines}

    except Exception as e:
        logging.error(f"Error while scraping {search_query}: {e}")
        return {"error": str(e)}

# Convenience functions for each type of news
def get_national_news():
    news_data = scrape_google_news("commercial real estate")
    save_news_to_file('national_news.json', news_data)
    return news_data

def get_regional_news():
    news_data = scrape_google_news("regional commercial real estate")
    save_news_to_file('regional_news.json', news_data)
    return news_data

def get_emerging_news():
    news_data = scrape_google_news("emerging commercial real estate")
    save_news_to_file('emerging_news.json', news_data)
    return news_data
