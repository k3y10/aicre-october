import React, { useState } from 'react';
import Image from 'next/image'; // For rendering the original image

interface CapitalLayer {
  name: string;
  value: number; // Value in millions
  color: string; // Color to represent the layer
}

const CapTable: React.FC = () => {
  // Define the layers of the capital stack
  const [capitalLayers, setCapitalLayers] = useState<CapitalLayer[]>([
    { name: 'Est. Market Value After Stabilization', value: 1000, color: '#B5C5FF' }, // Example value: 500M
    { name: 'Appraised Value', value: 1000, color: '#A6C5A9' }, // 1B
    { name: 'Acquisition Cost', value: 3000, color: '#A6C5A9' }, // 3B
    { name: 'Leverage (Debt Secured Against)', value: 5000, color: '#6B4C35' }, // 5B
  ]);                                                                   

  const totalValue = capitalLayers.reduce((sum, layer) => sum + layer.value, 0);

  // Function to update layer value based on user input
  const handleLayerChange = (index: number, newValue: number) => {
    const updatedLayers = capitalLayers.map((layer, i) =>
      i === index ? { ...layer, value: newValue } : layer
    );
    setCapitalLayers(updatedLayers);
  };

  return (
    <div className="cap-table-container">
      <h2 className="font-bold">Potential CRE Cap Table</h2>

      {/* Capital Stack Visualization */}
      <div className="capital-stack">
        {capitalLayers.map((layer, index) => {
          const heightPercentage = (layer.value / totalValue) * 100;
          return (
            <div
              key={index}
              className="capital-layer"
              style={{
                height: `${heightPercentage}%`,
                backgroundColor: layer.color,
              }}
            >
              <span className="layer-label">
                {`${layer.name}: $${(layer.value / 10).toFixed(1)}M`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Slider controls for each capital layer */}
      <div className="sliders">
        {capitalLayers.map((layer, index) => (
          <div key={index} className="slider-container">
            <label>{layer.name}</label>
            <input
              type="range"
              min={100}
              max={10000}
              value={layer.value}
              onChange={(e) => handleLayerChange(index, Number(e.target.value))}
            />
            <span>{`$${(layer.value / 10).toFixed(1)}M`}</span>
          </div>
        ))}
      </div>

      {/* Comparison Image Section */}
      <div className="comparison-section">
        <h3>Comparison with Original</h3>
        <Image
          src="/captable.png" // Ensure the uploaded image is in the /public folder
          alt="Original Cap Table"
          width={400}
          height={500}
          objectFit="contain"
        />
      </div>

      <style jsx>{`
        .cap-table-container {
          padding: 20px;
          text-align: center;
        }

        h2 {
          margin-bottom: 20px;
        }

        .capital-stack {
          width: 200px;
          height: 400px;
          border: 2px solid #333;
          margin: 0 auto;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .capital-layer {
          position: relative;
          width: 100%;
          border-top: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: height 0.2s ease;
        }

        .layer-label {
          color: #000;
          font-size: 14px;
          font-weight: bold;
          position: absolute;
        }

        .sliders {
          margin-top: 30px;
        }

        .slider-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        label {
          margin-right: 15px;
          width: 150px;
          text-align: left;
          font-weight: bold;
        }

        input[type='range'] {
          flex: 1;
          margin-right: 10px;
        }

        .comparison-section {
          margin-top: 40px;
        }

        .comparison-section h3 {
          margin-bottom: 10px;
          color: #333;
        }

        @media (max-width: 768px) {
          .capital-stack {
            height: 300px;
            width: 150px;
          }

          .layer-label {
            font-size: 12px;
          }

          .slider-container label {
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default CapTable;
