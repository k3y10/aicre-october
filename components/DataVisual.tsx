import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

// Register necessary chart elements
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

// Define the props for Address data
interface Address {
  propertyName: string;
  type: string;
  noi: number;
  value: number;
  leverage: number;
}

interface DataVisualProps {
  addresses: Address[];
}

const DataVisual: React.FC<DataVisualProps> = ({ addresses }) => {
  // Prepare data for the charts
  const propertyNames = addresses.map((address) => address.propertyName);
  const propertyValues = addresses.map((address) => address.value);
  const noiValues = addresses.map((address) => address.noi);
  const leverageValues = addresses.map((address) => address.leverage);

  // Bar chart data and options
  const barChartData = {
    labels: propertyNames,
    datasets: [
      {
        label: 'Property Value',
        data: propertyValues,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
      },
      {
        label: 'NOI',
        data: noiValues,
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        borderWidth: 1,
      },
      {
        label: 'Leverage (%)',
        data: leverageValues,
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Property Analysis (Bar Chart)',
      },
    },
  };

  // Pie chart data and options
  const pieChartData = {
    labels: propertyNames,
    datasets: [
      {
        label: 'Property Value Distribution',
        data: propertyValues,
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Property Value Distribution (Pie Chart)',
      },
    },
  };

  // Line chart data and options (for NOI trend)
  const lineChartData = {
    labels: propertyNames,
    datasets: [
      {
        label: 'NOI',
        data: noiValues,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'NOI Trends (Line Chart)',
      },
    },
  };

  return (
    <div className="data-visual">
      <div className="chart-container">
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      <div className="chart-container">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>

      <style jsx>{`
        .data-visual {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Make sure it fits on smaller screens */
          gap: 20px;
          width: 100%;
          margin-top: 15px;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-container {
          background-color: #fff;
          padding: 20px;
          align-content: center;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          max-width: 100%;
          overflow: hidden; /* Ensure the chart stays within its container */
        }

        .chart-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 1200px) {
          .data-visual {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .data-visual {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DataVisual;
