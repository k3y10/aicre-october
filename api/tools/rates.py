import requests
from bs4 import BeautifulSoup

def fetch_interest_rates():
    """Scrapes commercial real estate interest rates from public sources."""
    
    # URLs for scraping real-time interest rate data
    urls = [
        "https://www.commercialloandirect.com/commercial-rates.php",  # Adjust to target rates
    ]

    rates = []

    for url in urls:
        try:
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if response.status_code != 200:
                continue  # Try next URL if the response fails

            soup = BeautifulSoup(response.text, 'html.parser')

            # Example selectors; adjust these based on the actual HTML structure of each site
            # This will need to be updated according to the actual page structure
            for item in soup.select(".specific-rate-class"):  # Replace with actual class for each rate
                rate_name = item.find("span", class_="rate-name").text.strip() if item.find("span", class_="rate-name") else "Unknown Rate"
                rate_value = item.find("span", class_="rate-value").text.strip() if item.find("span", class_="rate-value") else "N/A"
                
                rates.append({
                    "source": rate_name,
                    "value": rate_value,
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
            {"source": "SOFR 30 day", "value": "4.840%"},
            {"source": "Prime", "value": "8.000%"},
            {"source": "LIBOR 30 day", "value": "0.000%"},
            {"source": "5 yr Treasury", "value": "3.990%"},
            {"source": "10 yr Treasury", "value": "3.880%"},
        ]

    return rates
