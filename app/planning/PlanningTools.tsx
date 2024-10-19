import React from 'react';
import { ChecklistIcon, MapIcon, RulerIcon } from '@/components/icons';

const PlanningTools: React.FC = () => {
  return (
    <div className="planning-tools">
      <h3>Planning Tools</h3>
      <div className="planning-grid">
        <div className="planning-item">
          <ChecklistIcon />
          <p>Checklist</p>
        </div>
        <div className="planning-item">
          <MapIcon />
          <p>Property Mapping</p>
        </div>
        <div className="planning-item">
          <RulerIcon />
          <p>Measurements</p>
        </div>
      </div>

      <style jsx>{`
        .planning-tools {
          padding: 20px;
        }

        .planning-grid {
          display: flex;
          gap: 20px;
        }

        .planning-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .planning-item p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default PlanningTools;
