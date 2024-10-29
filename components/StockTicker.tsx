import React, { useState, useEffect } from 'react';

interface StockItem {
  symbol: string;
  price: string;
  change: string;
}

const StockTicker: React.FC = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);

  // Fetch stock ticker data (static data for now, replace with API if needed)
  const fetchStockData = async () => {
    const stockItems: StockItem[] = [
      { symbol: 'AAPL', price: '150.23', change: '+1.23%' },
      { symbol: 'GOOGL', price: '2750.65', change: '-0.56%' },
      { symbol: 'AMZN', price: '3400.12', change: '+2.67%' },
      { symbol: 'TSLA', price: '880.32', change: '-1.45%' },
      { symbol: 'MSFT', price: '299.22', change: '+0.98%' },
      { symbol: 'AAPL', price: '150.23', change: '+1.23%' },
      { symbol: 'GOOGL', price: '2750.65', change: '-0.56%' },
      { symbol: 'AMZN', price: '3400.12', change: '+2.67%' },
      { symbol: 'TSLA', price: '880.32', change: '-1.45%' },
      { symbol: 'MSFT', price: '299.22', change: '+0.98%' },
    ];
    setStockData(stockItems);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="stock-ticker">
      <div className="ticker-content">
        {/* Duplicate the stock data to ensure seamless looping */}
        {[...stockData, ...stockData].map((stock, index) => (
          <div className="ticker-item" key={index}>
            <span className="stock-symbol">{stock.symbol}</span>:
            <span className="stock-price">{stock.price}</span>
            <span className={`stock-change ${stock.change.includes('+') ? 'positive' : 'negative'}`}>
              {stock.change}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .stock-ticker {
          background-color: #333;
          border-radius: 4px;
          padding: 10px;
          overflow: hidden;
          color: white;
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
        }

        .ticker-content {
          display: flex;
          animation: tickerMove 20s linear infinite;
          min-width: 100%; /* Ensure it starts at full width */
        }

        @keyframes tickerMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%); /* Only move halfway since we duplicate the items */
          }
        }

        .ticker-item {
          margin-right: 50px;
        }

        .stock-symbol {
          font-weight: bold;
        }

        .stock-price {
          margin-left: 5px;
        }

        .stock-change {
          margin-left: 5px;
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

export default StockTicker;
