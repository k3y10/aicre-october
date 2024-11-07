import React, { useState, useEffect } from 'react';

interface InterestRateItem {
  source: string;       // Source or name, e.g., "SOFR"
  rate: string;         // Current interest rate value, e.g., "4.840%"
  previousRate?: string; // Previous interest rate value for correlation
}

const InterestRateTicker: React.FC = () => {
  const [rateData, setRateData] = useState<InterestRateItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Comprehensive placeholder data for fallback
  const placeholderData: InterestRateItem[] = [
    { source: 'SOFR 30 day', rate: '4.840%', previousRate: '4.750%' },
    { source: 'Prime', rate: '8.000%', previousRate: '7.750%' },
    { source: 'LIBOR 30 day', rate: '0.000%', previousRate: '0.100%' },
    { source: '5 yr Treasury', rate: '3.990%', previousRate: '3.800%' },
    { source: '10 yr Treasury', rate: '3.880%', previousRate: '3.700%' },
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
        rate: rate.value || "N/A",
        previousRate: rate.previousRate || "N/A", // Assuming your API returns previous rates
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
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {/* Use either fetched data or placeholders if data is not loaded */}
          {(isDataLoaded ? rateData : placeholderData).map((rate, index) => {
            const currentRateValue = parseFloat(rate.rate);
            const previousRateValue = parseFloat(rate.previousRate || '0');

            let colorClass = 'neutral';
            if (currentRateValue > previousRateValue) {
              colorClass = 'positive'; // Current rate is greater than previous rate
            } else if (currentRateValue < previousRateValue) {
              colorClass = 'negative'; // Current rate is less than previous rate
            }

            return (
              <span className="ticker-item" key={index}>
                <span className="rate-source">{rate.source}</span>: 
                <span className={`rate-value ${colorClass}`}>{rate.rate}</span>
                {index < (isDataLoaded ? rateData.length : placeholderData.length) - 1 && '   '} {/* Add spacing between items */}
              </span>
            );
          })}
          {/* Duplicate the content for continuous scrolling effect */}
          {(isDataLoaded ? rateData : placeholderData).map((rate, index) => {
            const currentRateValue = parseFloat(rate.rate);
            const previousRateValue = parseFloat(rate.previousRate || '0');

            let colorClass = 'neutral';
            if (currentRateValue > previousRateValue) {
              colorClass = 'positive';
            } else if (currentRateValue < previousRateValue) {
              colorClass = 'negative';
            }

            return (
              <span className="ticker-item" key={`${index}-duplicate`}>
                <span className="rate-source">{rate.source}</span>: 
                <span className={`rate-value ${colorClass}`}>{rate.rate}</span>
                {index < (isDataLoaded ? rateData.length : placeholderData.length) - 1 && '   '}
              </span>
            );
          })}
        </div>
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

        .ticker-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .ticker-content {
          display: flex;
          animation: tickerMove 30s linear infinite; /* Adjust the speed here */
          width: calc(200%); /* Double the width to accommodate both sets of items */
        }

        @keyframes tickerMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%); /* Move by half the width of the duplicated content */
          }
        }

        .ticker-item {
          margin-right: 50px;
        }

        .rate-source {
          font-weight: bold;
          color: #FFFFFF; // Keep source color neutral
        }

        .rate-value {
          margin-left: 5px;
        }

        .positive {
          color: #4CAF50; // Green for positive correlation
        }

        .negative {
          color: #FF5252; // Red for negative correlation
        }

        .neutral {
          color: #FFFFFF; // White for neutral rates
        }
      `}</style>
    </div>
  );
};

export default InterestRateTicker;
