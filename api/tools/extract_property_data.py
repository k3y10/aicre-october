import fitz  # PyMuPDF
import re
import json
import spacy

# Load the spaCy model for entity recognition
nlp = spacy.load("en_core_web_sm")

# Dictionary of common real estate terms and patterns
keyword_dict = {
    "address": r"(?:address|location|property):?\s*(.*)",
    "tenant": r"(\w[\w\s]+?)\s+[\(\-]?\$\d[\d,\.]+",
    "amount": r"\$\d[\d,\.]+",
    "status": r"(Open credit|Unpaid rent|Paid rent|Prepaid cam|Late charge|Shortpaid cam|Open cam)",
    "occupancy_rate": r"(occupancy rate):?\s*(\d{1,3}%)",
    "lease_expiration": r"(lease expiration|lease end date):?\s*(\d{1,2}/\d{1,2}/\d{2,4})",
    "square_footage": r"(square footage|sq ft):?\s*([\d,]+)",
    "net_operating_income": r"(NOI|net operating income):?\s*\$?([\d,\.]+)",
    "capital_expenditure": r"(capex|capital expenditures?):?\s*\$?([\d,\.]+)",
    "annual_rent": r"(annual rent|annual rental income):?\s*\$?([\d,\.]+)",
    "monthly_rent": r"(monthly rent):?\s*\$?([\d,\.]+)",
    "cam_charges": r"(CAM|common area maintenance):?\s*\$?([\d,\.]+)",
    "tenant_improvements": r"(tenant improvements):?\s*\$?([\d,\.]+)",
    "management_fees": r"(management fees):?\s*\$?([\d,\.]+)",
    "debt_service": r"(debt service):?\s*\$?([\d,\.]+)",
    "property_tax": r"(property tax):?\s*\$?([\d,\.]+)",
    "insurance": r"(insurance):?\s*\$?([\d,\.]+)",
    "vacancy_rate": r"(vacancy rate):?\s*(\d{1,3}%)",
    "maintenance_reserves": r"(maintenance reserves?):?\s*\$?([\d,\.]+)",
    "effective_gross_income": r"(EGI|effective gross income):?\s*\$?([\d,\.]+)",
    "gross_rental_income": r"(gross rental income):?\s*\$?([\d,\.]+)",
    "net_cash_flow": r"(net cash flow):?\s*\$?([\d,\.]+)",
}

def extract_data_from_pdf(file_path):
    """Extracts tenant, property, and additional financial details from a PDF file."""
    extracted_data = {
        "property_details": {},
        "tenants": [],
        "financial_details": [],
        "additional_entities": {}
    }

    # Read and concatenate all text in the PDF
    with fitz.open(file_path) as pdf:
        text = ""
        for page in pdf:
            text += page.get_text()

    # Extract specific property details based on expanded keywords
    for key, pattern in keyword_dict.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted_data["property_details"][key] = match.group(1).strip()

    # Extract tenants, financial details, and statuses
    tenant_pattern = re.compile(
        r"(\w[\w\s]+?)\s+\$\d[\d,\.]+\s+([\w\s&,.]+)",
        re.MULTILINE
    )
    for match in tenant_pattern.finditer(text):
        tenant_name = match.group(1).strip()
        amount = match.group(2).strip()
        status = match.group(3).strip()

        extracted_data["tenants"].append({
            "tenant_name": tenant_name,
            "amount": amount,
            "status": status
        })
        extracted_data["financial_details"].append({
            "tenant_name": tenant_name,
            "amount_due": amount,
            "payment_status": status
        })

    # Process text with spaCy to capture additional entities
    doc = nlp(text)
    for ent in doc.ents:
        entity_type = ent.label_.lower()
        entity_text = ent.text.strip()

        if entity_type not in extracted_data["additional_entities"]:
            extracted_data["additional_entities"][entity_type] = []

        if entity_text not in extracted_data["additional_entities"][entity_type]:
            extracted_data["additional_entities"][entity_type].append(entity_text)

    # Additional structured fields from spaCy NER
    additional_entities = {
        "organizations": [],
        "dates": [],
        "monetary_values": []
    }

    # Capture organizations, dates, and monetary values using spaCy
    for ent in doc.ents:
        if ent.label_ == "ORG":
            additional_entities["organizations"].append(ent.text)
        elif ent.label_ == "DATE":
            additional_entities["dates"].append(ent.text)
        elif ent.label_ in {"MONEY", "PERCENT"}:
            additional_entities["monetary_values"].append(ent.text)

    extracted_data["additional_entities"].update(additional_entities)

    # Catch-all pattern for additional unstructured key-value pairs
    general_data_pattern = re.compile(r"(\b\w+\b(?: \b\w+\b){0,3})\s*:\s*(.+)")
    for match in general_data_pattern.finditer(text):
        key, value = match.groups()
        extracted_data["additional_entities"].setdefault(key.strip(), []).append(value.strip())

    return json.dumps(extracted_data, indent=4)
