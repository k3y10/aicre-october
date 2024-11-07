import os
import requests
import json

# Census Bureau API URL (modify to match your specific data requirements)
CENSUS_API_BASE_URL = "https://api.census.gov/data"

# Fetch Census data for a given region
def get_census_data(region: str):
    # Adjust the API endpoint and parameters to match the Census data of interest
    api_key = os.getenv('NEXT_PUBLIC_CENSUS_API_KEY')  # Ensure that the API key is set as an environment variable
    endpoint = f"{CENSUS_API_BASE_URL}/2019/acs/acs5"
    
    # You can adjust the query parameters here, depending on the data fields needed
    params = {
        "get": "NAME,B01003_001E",  # Modify based on the Census data fields you need (e.g., population)
        "for": f"state:{region}",  # Region/state can be passed to filter data
        "key": api_key
    }

    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        data = response.json()

        # Map the fields and return the data in a user-friendly format
        return parse_census_data(data)
    except requests.RequestException as e:
        print(f"Error fetching Census data: {e}")
        return {"error": "Failed to fetch census data"}

# Parse and format the fetched Census data
def parse_census_data(raw_data):
    # Example of converting raw data to a more usable format
    if not raw_data or len(raw_data) < 2:
        return {"error": "No census data available"}

    headers = raw_data[0]
    values = raw_data[1:]

    census_data = []
    for value in values:
        # Create a dictionary for each row in the data and map header names to values
        census_record = {headers[i]: value[i] for i in range(len(headers))}
        census_data.append(census_record)

    return {
        "census_results": census_data,
        "message": "Successfully retrieved Census data"
    }

# Example function to integrate both Zillow and Census data (you can expand this further)
def match_zillow_and_census(zillow_data, region):
    # Fetch Census data based on the region
    census_data = get_census_data(region)

    # You can define how to map or match data between Zillow and Census here
    if "error" in census_data:
        return {"error": "Failed to fetch matching census data"}

    return {
        "zillow_data": zillow_data,
        "census_data": census_data
    }

if __name__ == "__main__":
    # Test fetching Census data for a specific region
    region = "06"  # Example state code for California
    print(get_census_data(region))
