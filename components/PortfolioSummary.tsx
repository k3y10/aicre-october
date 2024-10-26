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
  leverageTrend,
  yieldRateTrend,
  dscrTrend,
}) => {
  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <ArrowUpIcon color="green" />
    ) : (
      <ArrowDownIcon color="red" />
    );
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

        <Tippy content="Average leverage percentage for all properties">
          <div className="summary-item">
            <p>Average Leverage</p>
            <h3>
              {(totalLeverage * 100).toFixed(2)}% {getTrendIcon(leverageTrend)}
            </h3>
          </div>
        </Tippy>

        <Tippy content="Yield Rate is the annual income (NOI) divided by property value">
          <div className="summary-item">
            <p>Average Yield Rate</p>
            <h3>
              {(totalYieldRate * 100).toFixed(2)}% {getTrendIcon(yieldRateTrend)}
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
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          font-family: 'Arial', sans-serif;
        }

        h3 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }

        .summary-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .summary-item {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .summary-item:hover {
          transform: scale(1.05);
        }

        .summary-item p {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .summary-item h3 {
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .summary-item h3 svg {
          margin-left: 8px;
        }

        @media (max-width: 1024px) {
          .summary-details {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
        }

        @media (max-width: 768px) {
          .summary-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .summary-item h3 {
            font-size: 20px;
          }

          h3 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioSummary;
