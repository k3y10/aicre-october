import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface CashFlowProjection {
  month: string;
  actual?: number;
  projected?: number;
}

interface Property {
  id: string;
  propertyName: string;
  value: number;
  noi: number;
  cashYTD: number;
}

const PortfolioSummary: React.FC = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [totalNOI, setTotalNOI] = useState(0);
  const [totalCashYTD, setTotalCashYTD] = useState(0);
  const [totalEquity, setTotalEquity] = useState(0);
  const [cashFlowProjections, setCashFlowProjections] = useState<CashFlowProjection[]>([]);

  useEffect(() => {
    const fetchPropertiesData = async () => {
      try {
        const propertyFiles = ['brickyardplaza.json', 'portolaplaza.json'];
        const propertyData: Property[] = await Promise.all(
          propertyFiles.map(async (file) => {
            const response = await fetch(`/property_types/${file}`);
            return await response.json();
          })
        );

        const totalValueCalc = propertyData.reduce((sum, property) => sum + property.value, 0);
        const totalNOICalc = propertyData.reduce((sum, property) => sum + property.noi, 0);
        const totalCashYTDCalc = propertyData.reduce((sum, property) => sum + property.cashYTD, 0);
        const totalEquityCalc = totalValueCalc * 0.65;

        setTotalValue(totalValueCalc);
        setTotalNOI(totalNOICalc);
        setTotalCashYTD(totalCashYTDCalc);
        setTotalEquity(totalEquityCalc);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December

        // Set actual and projected data for a rolling 3 months past and 3 months forward
        const projectionData = [
          { month: 'Aug', actual: 250000 },
          { month: 'Sep', actual: 100000 },
          { month: 'Oct', actual: 0 },
          { month: 'Nov', projected: 80000 },
          { month: 'Dec', projected: -30000 },
          { month: 'Jan', projected: 50000 }
        ];

        const filteredProjections = projectionData.map((data, index) => {
          const monthIndex = new Date(`${data.month} 1, ${currentDate.getFullYear()}`).getMonth();
          return monthIndex <= currentMonth ? { month: data.month, actual: data.actual } : { month: data.month, projected: data.projected };
        });

        setCashFlowProjections(filteredProjections);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    fetchPropertiesData();
  }, []);

  const chartData = {
    labels: cashFlowProjections.map((item) => item.month),
    datasets: [
      {
        label: 'Actual',
        data: cashFlowProjections.map((item) => item.actual ?? null),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Projected',
        data: cashFlowProjections.map((item) => item.projected ?? null),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: true } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="portfolio-summary">
      <div className="header">
      <p>{new Date().toLocaleDateString()}</p>
        <h2>Portfolio Summary</h2>        
      </div>

      <div className="summary-details">
        <Tippy content="Estimated market value based on recent year’s NOI with estimated CAP rate">
          <div className="summary-item">
            <p>Total Value (est.)</p>
            <h3>${totalValue.toLocaleString('en-US')}</h3>
          </div>
        </Tippy>

        <Tippy content="Total NOI from prior year’s NOI results">
          <div className="summary-item">
            <p>Total NOI</p>
            <h3>${totalNOI.toLocaleString('en-US')}</h3>
          </div>
        </Tippy>

        <Tippy content="Year-to-Date Cash">
          <div className="summary-item">
            <p>Cash YTD</p>
            <h3>${totalCashYTD.toLocaleString('en-US')}</h3>
          </div>
        </Tippy>

        <Tippy content="Estimated equity based on total value calculation">
          <div className="summary-item">
            <p>Total Equity (est.)</p>
            <h3>${totalEquity.toLocaleString('en-US')}</h3>
          </div>
        </Tippy>
      </div>

      <div className="cash-flow-projections">
        <h4>Cash Flow Projections</h4>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <style jsx>{`
        .portfolio-summary {
          background-color: #ffffff;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          width: 100%;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 20px;
          font-weight: bold;
        }

        p {
          font-size: 14px;
          color: #666;
        }

        .summary-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .summary-item {
          background-color: #f8f9fa;
          padding: 18px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .summary-item:hover {
          transform: translateY(-5px);
        }

        .summary-item p {
          font-size: 13px;
          color: #777;
          margin-bottom: 8px;
        }

        .summary-item h3 {
          font-size: 18px;
          margin: 0;
          font-weight: bold;
        }

        .cash-flow-projections {
          margin-top: 24px;
        }

        .cash-flow-projections h4 {
          font-size: 18px;
          margin-bottom: 12px;
          text-align: center;
        }

        .chart-container {
          height: 300px;
        }

        @media (max-width: 1024px) {
          .summary-details {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .portfolio-summary {
            padding: 16px;
          }

          .summary-details {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }

          .chart-container {
            height: 250px;
          }
        }

        @media (max-width: 480px) {
          .summary-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .chart-container {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioSummary;
