import requests
from api.data.zillow import scrape_zillow_data
from api.data.census import get_census_data
from api.data.cherre import get_cherre_data
from api.data.zonda import get_zonda_data

def generate_aicre_report(address, region):
    """Generate the AiCRE Report for a property address."""
    # Step 1: Scrape Zillow data
    zillow_data = scrape_zillow_data(address)
    
    # Step 2: Get census and economic data
    census_data = get_census_data(region)
    cherre_data = get_cherre_data(region)
    zonda_data = get_zonda_data(address)

    # Step 3: Calculate SREO metrics
    price_trend = float(zillow_data.get('trend', 0).strip('%')) / 100
    gdp_growth = float(census_data.get('gdp', 0)) / 100
    housing_stock = census_data.get('housing', {}).get('stock', 10000)  # Placeholder
    population_growth = census_data.get('population', {}).get('growth', 0.02)  # Placeholder

    sre_index = (price_trend * 0.4) + (gdp_growth * 0.3) + ((population_growth / housing_stock) * 0.3)

    # Step 4: Fetch additional metrics from Cherre, Nextdoor, and Zonda for local insight
    neighborhood_metrics = cherre_data.get('neighborhood', {})
    development_trends = zonda_data.get('development_trends', {})

    return {
        'SREO Index': round(sre_index, 2),
        'Market Trend': zillow_data.get('trend'),
        'GDP Growth': census_data.get('gdp'),
        'Housing Stock': housing_stock,
        'Population Growth': population_growth,
        'Neighborhood Metrics': neighborhood_metrics,
        'Development Trends': development_trends,
    }
