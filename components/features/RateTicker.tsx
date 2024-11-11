import React, { useState, useEffect } from 'react';

interface InterestRateItem {
  index: string; // Name of the rate, e.g., "SOFR 30 day"
  rate: string;  // Current rate, e.g., "4.840%"
}

const InterestRateTicker: React.FC = () => {
  const [rateData, setRateData] = useState<InterestRateItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Placeholder data for fallback
  const placeholderData: InterestRateItem[] = [
    { index: 'SOFR 30 day', rate: '4.840%' },
    { index: 'Prime', rate: '8.000%' },
    { index: 'LIBOR 30 day', rate: '0.000%' },
    { index: '5 yr Treasury', rate: '3.990%' },
    { index: '10 yr Treasury', rate: '3.880%' },
  ];

  const fetchRateData = async () => {
    try {
      const response = await fetch('/api/rates');

      if (!response.ok) {
        throw new Error(`Failed to fetch interest rate data. Status: ${response.status}`);
      }

      const data = await response.json();
      setRateData(data.rates); // Adjusted to access the `rates` array from the response
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching interest rate data:', error);
      setRateData(placeholderData); // Use fallback data on error
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
          {Array(2).fill(isDataLoaded ? rateData : placeholderData).flat().map((rate, index) => (
            <span className="ticker-item" key={index}>
              <span className="rate-source">{rate.index}</span>:
              <span className="rate-value">{rate.rate}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .interest-rate-ticker {
          background-color: #333;
          border-radius: 8px;
          padding: 12px 0;
          overflow: hidden;
          color: white;
          white-space: nowrap;
          display: flex;
          align-items: center;
          font-family: 'Arial', sans-serif;
        }

        .ticker-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .ticker-content {
          display: flex;
          animation: tickerScrollRight 45s linear infinite; /* Adjusted duration for faster scroll */
          width: calc(200%); /* Ensures content is long enough for continuous scroll */
        }

        @keyframes tickerScrollRight {
          0% {
            transform: translateX(-50%); /* Start from the left */
          }
          100% {
            transform: translateX(0); /* Move to the right */
          }
        }

        .ticker-item {
          margin-left: 50px; /* Adjust margin if necessary */
          display: inline-block;
        }

        .rate-source {
          font-weight: bold;
          color: #ffffff;
        }

        .rate-value {
          margin-left: 8px;
          color: #4caf50; /* Green for better visibility */
        }
      `}</style>
    </div>
  );
};

export default InterestRateTicker;
