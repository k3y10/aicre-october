import { openaiApiKey } from '@/constants/env';
import { storeJsonData } from './firebaseClient';

interface PropertyInfo {
  propertyId: string;
  propertyName: string;
  value: number;
  noi: number;
  leverage: number;
  dscr: number;
  ownershipPercentage: number;
  location: string;
}

// Generate OpenAI prompt for analysis and recommendations specific to CRE
export const generateOpenAIPromptForCRE = (
  userId: string,
  properties: PropertyInfo[]
): string => {
  const limitedProperties = properties.slice(0, 5); // Limit to avoid token limit issues

  const propertyDetails = limitedProperties
    .map(
      (property, index) =>
        `Property ${index + 1} - ${property.propertyName}: Value: ${property.value} USD, NOI: ${property.noi}, DSCR: ${property.dscr}, Leverage: ${property.leverage * 100}%. Location: ${property.location}.`
    )
    .join('\n');

  const prompt = `
    You are a commercial real estate consultant working with clients who own multiple properties. Provide a comprehensive analysis for user ID ${userId}, covering the following areas:
    
    1. **Portfolio Performance**:
       - Analyze the user's portfolio, covering ${properties.length} properties:
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
export const generateCREInsights = async (
  userId: string,
  properties: PropertyInfo[]
): Promise<string | null> => {
  try {
    const openAIPrompt = generateOpenAIPromptForCRE(userId, properties);

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

      if (insightsText) {
        // Store the generated insights in Firebase or any storage backend
        await storeJsonData({
          insights: insightsText,
          timestamp: Date.now(),
          userId,
        });

        return insightsText;
      } else {
        console.error('Insights text is undefined or null.');
        return null;
      }
    } else {
      console.error('No insights available.');
      return null;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return null;
  }
};

// Fetch data and metrics for a given propertyId (CRE specific)
export const fetchCREDataAndMetrics = async (propertyId: string) => {
  try {
    const response = await fetch(
      `/api/cre/get_data_and_metrics?propertyId=${propertyId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching CRE data and metrics:', error);
    return null;
  }
};

// Store insights in Firebase or a backend service
export const storeInsights = async (userId: string, insights: string) => {
  try {
    const data = {
      userId,
      insights,
      timestamp: Date.now(),
    };

    await storeJsonData(data);
    console.log('Insights successfully stored.');
  } catch (error) {
    console.error('Error storing insights:', error);
  }
};
