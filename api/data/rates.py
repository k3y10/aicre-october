# rates.py

import requests
from bs4 import BeautifulSoup

def fetch_interest_rates():
    """Scrapes commercial real estate interest rates from public sources."""
    
    # URLs for scraping real-time interest rate data
    urls = [
        "https://www.bankrate.com/commercial-real-estate-rates",  # Placeholder URL, replace with actual
        "https://www.cbre.com/research-and-reports/market-trends"  # Placeholder URL, replace with actual
    ]

    rates = []

    for url in urls:
        try:
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if response.status_code != 200:
                continue  # Try next URL if the response fails

            soup = BeautifulSoup(response.text, 'html.parser')

            # Example selectors; adjust these based on the actual HTML structure of each site
            for item in soup.select(".rate-section .rate-item"):
                rate_name = item.find("h3", class_="rate-title").text.strip() if item.find("h3", class_="rate-title") else "Unknown Rate"
                rate_value = item.find("span", class_="rate-value").text.strip() if item.find("span", class_="rate-value") else "N/A"
                rate_change = item.find("span", class_="rate-change").text.strip() if item.find("span", class_="rate-change") else "0.00%"
                
                # Add a descriptive name if the rate source is known
                source_name = url.split('//')[1].split('/')[0]  # e.g., "bankrate.com" or "cbre.com"
                
                rates.append({
                    "source": source_name,
                    "name": rate_name,
                    "value": rate_value,
                    "change": rate_change
                })

            # Stop once data is successfully fetched
            if rates:
                break

        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue  # Try the next URL if an error occurs

    # Fallback to placeholder data if no rates were found
    if not rates:
        rates = [
            {"source": "Bankrate (placeholder)", "name": "30-Year Fixed", "value": "5.25%", "change": "+0.02%"},
            {"source": "CBRE (placeholder)", "name": "Commercial Mortgage", "value": "4.85%", "change": "-0.01%"},
            {"source": "Freddie Mac (placeholder)", "name": "Multifamily Mortgage", "value": "4.75%", "change": "0.00%"}
        ]

    return rates
