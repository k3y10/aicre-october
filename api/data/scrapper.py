import os
import json
import time
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from bs4 import BeautifulSoup

# Define the paths for storing scraped data
DATA_DIR = os.path.join(os.path.dirname(__file__), 'news_data')
os.makedirs(DATA_DIR, exist_ok=True)

NATIONAL_FILE = os.path.join(DATA_DIR, 'national.json')
REGIONAL_FILE = os.path.join(DATA_DIR, 'regional.json')
EMERGING_FILE = os.path.join(DATA_DIR, 'emerging.json')

# Setup Firefox WebDriver with headless option for efficiency
firefox_options = Options()
firefox_options.add_argument('--headless')

# Path to your Geckodriver executable
GECKODRIVER_PATH = "/usr/local/bin/geckodriver"

# Function to initialize WebDriver
def init_driver():
    service = Service(GECKODRIVER_PATH)
    driver = webdriver.Firefox(service=service, options=firefox_options)
    return driver

# Function to scrape headlines from Google News and log to terminal
def scrape_google_news(search_query, file_path):
    driver = init_driver()
    try:
        print(f"Starting scrape for: {search_query}")
        
        # Navigate to Google News and search for the query
        search_url = f"https://www.google.com/search?q={search_query}&tbm=nws"
        driver.get(search_url)
        time.sleep(5)  # Allow time for the page to load

        # Print out the page source for debugging
        print(driver.page_source)

        # Scroll down to load more results
        body = driver.find_element(By.TAG_NAME, "body")
        for _ in range(5):  # Adjust the range to scroll more or less
            body.send_keys(Keys.PAGE_DOWN)
            time.sleep(1)

        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scrape headlines and URLs, limit to 10 articles
        headlines = []
        for result in soup.select('div.dbsr')[:10]:
            title_elem = result.select_one('div.JheGif.nDgy9d')
            link_elem = result.find('a')
            if title_elem and link_elem:
                headlines.append({
                    'title': title_elem.get_text(),
                    'url': link_elem['href']
                })

        # Print how many headlines were found for debugging
        print(f"Found {len(headlines)} headlines.")

        # Save the headlines to a JSON file
        if headlines:
            with open(file_path, 'w') as f:
                json.dump({'articles': headlines}, f, indent=4)
            print(f"Saved {len(headlines)} headlines to {file_path}")
        else:
            print(f"No headlines found for {search_query}.")

    except Exception as e:
        print(f"Error while scraping {search_query}: {e}")
    finally:
        driver.quit()

# Main function to run all scrapes
def main():
    # Scrape National Commercial Real Estate News
    scrape_google_news("National Commercial Real Estate News", NATIONAL_FILE)

    # Scrape Regional Commercial Real Estate News (Adjust as needed for specific region)
    scrape_google_news("Regional Commercial Real Estate News", REGIONAL_FILE)

    # Scrape Emerging Commercial Real Estate News
    scrape_google_news("Emerging Commercial Real Estate News", EMERGING_FILE)

if __name__ == "__main__":
    main()
