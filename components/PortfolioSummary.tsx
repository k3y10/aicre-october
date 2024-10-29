import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@/components/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface PortfolioSummaryProps {
  totalValue: number;
  totalNOI: number;
  totalLeverage: number;
  totalYieldRate: number;
  totalDSCR: number;
  equity: number;
  debt: number;
  leverageTrend: 'up' | 'down';
  yieldRateTrend: 'up' | 'down';
  dscrTrend: 'up' | 'down';
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  totalNOI,
  totalLeverage,
  totalYieldRate,
  totalDSCR,
  equity,
  debt,
  leverageTrend,
  yieldRateTrend,
  dscrTrend,
}) => {
  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <ArrowUpIcon color="green" /> : <ArrowDownIcon color="red" />;
  };

  return (
    <div className="portfolio-summary">
      <h3>Portfolio Summary</h3>
      <div className="summary-details">
        <Tippy content="Total value of all properties in the portfolio">
          <div className="summary-item">
            <p>Total Value</p>
            <h3>${totalValue.toLocaleString()}</h3>
          </div>
        </Tippy>

        <Tippy content="Net Operating Income (NOI) represents revenue minus operating expenses">
          <div className="summary-item">
            <p>Total NOI</p>
            <h3>${totalNOI.toLocaleString()}</h3>
          </div>
        </Tippy>

        <Tippy content="Equity represents ownership in the portfolio">
          <div className="summary-item">
            <p>Equity</p>
            <h3>${equity.toLocaleString()}</h3>
          </div>
        </Tippy>

        <Tippy content="Yield Rate is the annual income (NOI) divided by property value">
          <div className="summary-item">
            <p>Yield %</p>
            <h3>
              {(totalYieldRate * 100).toFixed(2)}% {getTrendIcon(yieldRateTrend)}
            </h3>
          </div>
        </Tippy>

        <Tippy content="Total debt represents the liability in the portfolio">
          <div className="summary-item">
            <p>Debt</p>
            <h3>${debt.toLocaleString()}</h3>
          </div>
        </Tippy>

        <Tippy content="Average leverage percentage for all properties">
          <div className="summary-item">
            <p>Leverage</p>
            <h3>
              {(totalLeverage * 100).toFixed(2)}% {getTrendIcon(leverageTrend)}
            </h3>
          </div>
        </Tippy>

        <Tippy content="Debt Service Coverage Ratio (DSCR) is NOI divided by total debt service">
          <div className="summary-item">
            <p>Average DSCR</p>
            <h3>
              {totalDSCR.toFixed(2)} {getTrendIcon(dscrTrend)}
            </h3>
          </div>
        </Tippy>
      </div>

      {/* Styling */}
      <style jsx>{`
        .portfolio-summary {
          background-color: #fff;
          padding: 10px; /* Reduced padding */
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          font-family: 'Arial', sans-serif;
        }

        h3 {
          font-size: 18px; /* Smaller heading size */
          margin-bottom: 10px; /* Reduced margin */
          text-align: center;
        }

        .summary-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* Initially display in 4 columns */
          gap: 10px; /* Reduced gap between items */
        }

        .summary-item {
          background-color: #f8f9fa;
          padding: 8px; /* Reduced padding */
          border-radius: 6px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .summary-item:hover {
          transform: scale(1.04);
        }

        .summary-item p {
          font-size: 12px; /* Reduced font size */
          color: #666;
          margin-bottom: 6px; /* Reduced margin */
        }

        .summary-item h3 {
          font-size: 16px; /* Reduced font size for values */
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .summary-item h3 svg {
          margin-left: 6px;
        }

        /* Breakpoints for responsiveness */
        @media (max-width: 1200px) {
          .summary-details {
            grid-template-columns: repeat(3, 1fr); /* Display in 3 columns */
          }
        }

        @media (max-width: 1024px) {
          .summary-details {
            grid-template-columns: repeat(2, 1fr); /* Display in 2 columns */
            gap: 8px;
          }
        }

        @media (max-width: 768px) {
          .summary-details {
            grid-template-columns: 1fr; /* Single column layout */
            gap: 6px;
          }

          .summary-item h3 {
            font-size: 14px; /* Further reduced font size */
          }

          h3 {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .summary-details {
            gap: 4px; /* Smaller gap for mobile */
          }

          .summary-item h3 {
            font-size: 12px; /* Smallest font size for mobile */
          }

          .summary-item p {
            font-size: 10px;
          }

          h3 {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioSummary;
