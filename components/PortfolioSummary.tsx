import React from 'react';

interface PortfolioSummaryProps {
  totalValue: number;
  totalNOI: number;
  totalLeverage: number;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ totalValue, totalNOI, totalLeverage }) => {
  return (
    <div className="portfolio-summary">
      <div className="summary-item">
        <h4>Total Value</h4>
        <p>${totalValue.toLocaleString()}</p>
      </div>
      <div className="summary-item">
        <h4>Total NOI</h4>
        <p>${totalNOI.toLocaleString()}</p>
      </div>
      <div className="summary-item">
        <h4>Total Leverage</h4>
        <p>{(totalLeverage * 100).toFixed(2)}%</p>
      </div>

      <style jsx>{`
        .portfolio-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .summary-item {
          text-align: center;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          width: 30%;
        }

        .summary-item h4 {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .summary-item p {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default PortfolioSummary;
