import { openaiApiKey } from '@/constants/env';

interface PropertyInfo {
  propertyId: string;
  propertyName: string;
  value: number;
  noi: number;
  leverage: number;
  dscr: number;
  ownershipPercentage: number;
  location: string;
  latitude: number;
  longitude: number;
}

// Generate OpenAI prompt for analysis and recommendations specific to CRE
export const generateOpenAIPromptForCRE = (properties: PropertyInfo[]): string => {
  const limitedProperties = properties.slice(0, 5); // Limit to avoid token limit issues

  const propertyDetails = limitedProperties
    .map(
      (property, index) =>
        `Property ${index + 1} - ${property.propertyName}: Value: ${property.value} USD, NOI: ${property.noi}, DSCR: ${property.dscr}, Leverage: ${property.leverage * 100}%. Location: ${property.location}.`
    )
    .join('\n');

  const prompt = `
    You are a commercial real estate consultant analyzing a portfolio of ${properties.length} properties. Provide a comprehensive analysis covering the following areas:

    1. **Portfolio Performance**:
       - Analyze the user's portfolio:
       ${propertyDetails}

    2. **Financial Health**:
       - Evaluate the overall financial health of the portfolio based on NOI, leverage, DSCR, and ownership percentages.
       - Suggest ways to optimize the portfolio for better cash flow and long-term growth.

    3. **Growth Opportunities**:
       - Highlight potential opportunities to refinance, invest, or restructure the portfolio to maximize returns.

    **Property Details**:
    ${propertyDetails}
  `;

  return prompt;
};

// Function to generate insights using OpenAI for CRE properties
export const generateCREInsights = async (properties: PropertyInfo[]): Promise<string | null> => {
  try {
    const openAIPrompt = generateOpenAIPromptForCRE(properties);

    const payload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You are a CRE consultant providing analysis and recommendations on property portfolios. Your focus is on financial health and potential growth opportunities.
          `,
        },
        { role: 'user', content: openAIPrompt },
      ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (responseData.choices && responseData.choices.length > 0) {
      const insightsText = responseData.choices[0]?.message?.content;
      return insightsText || null;
    } else {
      console.error('No insights available.');
      return null;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return null;
  }
};

// Fetch data from JSON for the Mapbox properties
export const fetchPropertiesFromJson = async (propertyType: string): Promise<PropertyInfo[]> => {
  try {
    const response = await fetch(`/property_types/${propertyType}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property data:', error);
    return [];
  }
};

// Example function to analyze properties with Mapbox data
export const analyzeProperties = async (propertyType: string) => {
  const properties = await fetchPropertiesFromJson(propertyType);

  if (properties.length === 0) {
    console.error('No properties found for the selected type.');
    return null;
  }

  // Generate insights for the fetched properties
  const insights = await generateCREInsights(properties);
  console.log('Generated Insights:', insights);
  return insights;
};
