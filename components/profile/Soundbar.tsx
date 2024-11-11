import React from 'react';

const Soundbar: React.FC = () => {
  return (
    <div className="soundbar">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>

      <style jsx>{`
        .soundbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 50px;
          height: 20px;
          margin: 10px auto;
        }

        .bar {
          width: 4px;
          height: 10px;
          background-color: #5fd2d2;
          animation: sound 0.5s infinite ease-in-out;
        }

        .soundbar .bar:nth-child(1) {
          animation-delay: -0.4s;
        }

        .soundbar .bar:nth-child(2) {
          animation-delay: -0.3s;
        }

        .soundbar .bar:nth-child(3) {
          animation-delay: -0.2s;
        }

        .soundbar .bar:nth-child(4) {
          animation-delay: -0.1s;
        }

        .soundbar .bar:nth-child(5) {
          animation-delay: 0s;
        }

        @keyframes sound {
          0% {
            height: 4px;
          }
          50% {
            height: 20px;
          }
          100% {
            height: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Soundbar;
