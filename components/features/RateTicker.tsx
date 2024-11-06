import React, { useState, useEffect } from 'react';

interface InterestRateItem {
  source: string;      // Source or name, e.g., "Bankrate"
  rate: string;        // Interest rate value, e.g., "5.3%"
  change: string;      // Daily change or trend, e.g., "+0.02%"
  description?: string; // Additional info about the rate
}

const InterestRateTicker: React.FC = () => {
  const [rateData, setRateData] = useState<InterestRateItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Comprehensive placeholder data for fallback
  const placeholderData: InterestRateItem[] = [
    { source: 'Bankrate', rate: '5.25%', change: '+0.03%', description: '30-Year Fixed' },
    { source: 'CBRE', rate: '4.85%', change: '-0.01%', description: 'Prime Rate' },
    { source: 'JLL', rate: '5.10%', change: '+0.02%', description: 'Commercial Mortgage Rate' },
    { source: 'Freddie Mac', rate: '4.75%', change: '0.00%', description: 'Multifamily Mortgage' },
    { source: 'Fannie Mae', rate: '4.95%', change: '-0.05%', description: 'Agency Mortgage' },
    { source: 'U.S. Bank', rate: '6.25%', change: '+0.10%', description: 'Construction Loan' },
    { source: 'Wells Fargo', rate: '5.45%', change: '-0.02%', description: 'Bridge Loan' },
    { source: 'Chase', rate: '5.55%', change: '0.00%', description: 'CRE Permanent Loan' },
    { source: 'Goldman Sachs', rate: '4.95%', change: '+0.01%', description: 'CMBS Loan Rate' },
    { source: 'Marcus & Millichap', rate: '5.35%', change: '-0.04%', description: 'Retail Property Loan' }
  ];

  // Fetch interest rate data from the API
  const fetchRateData = async () => {
    try {
      const response = await fetch('/api/interest-rates');
      if (!response.ok) {
        throw new Error('Failed to fetch interest rate data');
      }
      const data = await response.json();

      const rateItems: InterestRateItem[] = data.rates.map((rate: any) => ({
        source: rate.source || "Unknown Source",
        rate: rate.rate || "N/A",
        change: rate.change || "N/A",
        description: rate.description || "Standard Rate"
      }));

      setRateData(rateItems);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching interest rate data:', error);
      setRateData(placeholderData);  // Use placeholder data on error
      setIsDataLoaded(false);
    }
  };

  useEffect(() => {
    fetchRateData();
  }, []);

  return (
    <div className="interest-rate-ticker">
      <div className="ticker-content">
        {/* Use either fetched data or placeholders if data is not loaded */}
        {(isDataLoaded ? rateData : placeholderData).map((rate, index) => (
          <div className="ticker-item" key={index}>
            <span className="rate-source">{rate.source}</span>:
            <span className="rate-value">{rate.rate}</span>
            <span className={`rate-change ${rate.change.includes('+') ? 'positive' : 'negative'}`}>
              {rate.change}
            </span>
            <span className="rate-description">({rate.description})</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .interest-rate-ticker {
          background-color: #333;
          border-radius: 4px;
          padding: 10px;
          overflow: hidden;
          color: white;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .ticker-content {
          display: flex;
          animation: tickerMove 20s linear infinite;
          min-width: 100%;
        }

        @keyframes tickerMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-item {
          margin-right: 50px;
        }

        .rate-source {
          font-weight: bold;
        }

        .rate-value {
          margin-left: 5px;
        }

        .rate-change {
          margin-left: 5px;
        }

        .rate-description {
          font-style: italic;
          margin-left: 5px;
          color: #ddd;
        }

        .positive {
          color: #4CAF50;
        }

        .negative {
          color: #FF5252;
        }
      `}</style>
    </div>
  );
};

export default InterestRateTicker;
