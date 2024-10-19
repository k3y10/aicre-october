import React from 'react';
import { FileUpload } from '@/components/icons';

const DataRoom: React.FC = () => {
  return (
    <div className="data-room">
      <h3>Data Room</h3>
      <div className="upload-section">
        <FileUpload />
        <p>Upload Property Data</p>
      </div>

      <style jsx>{`
        .data-room {
          padding: 20px;
        }

        .upload-section {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .upload-section p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default DataRoom;
