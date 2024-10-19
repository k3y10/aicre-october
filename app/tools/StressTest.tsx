import React, { useState } from 'react';

interface StressTestProps {
    address: string | null;
  }
  
  const StressTest: React.FC<StressTestProps> = ({ address }) => {
    const [testData, setTestData] = useState<string | null>(null);
    const [inputData, setInputData] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleStressTest = async () => {
    const result = `Stress test for ${inputData} at ${address}`;
    setTestData(result);
  };

  return (
    <div className="tool-container">
      <h2>Stress Test</h2>
      <div className="stress-test-input">
        <input 
          type="text" 
          placeholder="Enter data for stress testing..." 
          value={inputData} 
          onChange={handleInputChange} 
        />
        <button onClick={handleStressTest}>Run Stress Test</button>
      </div>
      {testData && (
        <div className="stress-test-result">
          <h3>Test Result:</h3>
          <p>{testData}</p>
        </div>
      )}
      <style jsx>{`
        .tool-container {
          padding: 20px;
        }
        .stress-test-input {
          margin-bottom: 20px;
        }
        input {
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          background-color: #007bff;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .stress-test-result {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default StressTest;
