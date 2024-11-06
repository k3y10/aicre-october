import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface CashFlowProjection {
  month: string;
  actual: number;
  projected: number;
}

interface Tenant {
  id: string;
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface Property {
  id: string;
  propertyName: string;
  city: string;
  type: string;
  address: string;
  noi: number;
  noiYTD: number;
  cashYTD: number;
  netCashFlowThisMonth: number;
  vacancy: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  tenants?: Tenant[];
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

        setCashFlowProjections([
          { month: 'Jul', actual: 12000, projected: 15000 },
          { month: 'Aug', actual: -5000, projected: -2000 },
          { month: 'Sep', actual: 10000, projected: 12000 },
          { month: 'Oct', actual: 0, projected: 10000 },
          { month: 'Nov', actual: 8000, projected: 9000 },
          { month: 'Dec', actual: -3000, projected: 5000 },
        ]);
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
        data: cashFlowProjections.map((item) => item.actual),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Projected',
        data: cashFlowProjections.map((item) => item.projected),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: true } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="portfolio-summary">
      <div className="header">
        <h3>CRE Portfolio Summary</h3>
        <p>{new Date().toLocaleDateString()}</p>
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
          background-color: #fff;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          font-family: 'Arial', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 18px;
        }

        p {
          font-size: 14px;
          color: #666;
        }

        .summary-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .summary-item {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .summary-item:hover {
          transform: scale(1.04);
        }

        .summary-item p {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .summary-item h3 {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }

        .cash-flow-projections {
          margin-top: 20px;
        }

        .cash-flow-projections h4 {
          font-size: 16px;
          margin-bottom: 10px;
          text-align: center;
        }

        .chart-container {
          height: 250px; /* Adjust chart height here */
        }

        @media (max-width: 1024px) {
          .summary-details {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .summary-details {
            grid-template-columns: 1fr;
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
