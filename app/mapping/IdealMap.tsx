import React from 'react';
import Image from 'next/image';

// Use the imported image from the /public folder (recommended in Next.js)
const MapImage = '/ideal.png'; // Ensure this image is in your public folder

const IdealMap: React.FC = () => {
  return (
    <div className="map-container">
      {/* Static Map Showcase */}
      <div className="map-image">
        <Image
          src={MapImage}
          alt="AI-Powered Map Showcase"
          layout="responsive"
          width={1600} // Adjust to match the aspect ratio of your image
          height={900} // For example, a 16:9 ratio image
          objectFit="contain" // Ensures the image scales while maintaining its aspect ratio
          priority={true} // Ensures the image is loaded quickly
        />
      </div>

      {/* Section for AI-Powered features */}
      <div className="description">
        <h2>The Future of AiCRE: AI-Powered Map and Analytics</h2>
        <p>
          The AiCRE platform is evolving to provide advanced AI-powered tools to help you manage and analyze commercial real estate more effectively. 
          Our next iteration of the map will integrate interactive features with AI intelligence at its core.
        </p>
        <ul>
          <li><strong>AI-Driven Insights:</strong> Real-time data analysis, with property values, trends, and predictions powered by AI.</li>
          <li><strong>Smart Recommendations:</strong> AI will automatically suggest optimal properties, investments, and areas to watch based on real-time market analysis.</li>
          <li><strong>Intelligent Filtering:</strong> Filter properties by risk, value, and other factors, and let AI surface the best matches for your portfolio.</li>
          <li><strong>Dynamic Visualizations:</strong> As you zoom in on specific regions, our AI will provide deeper, contextual insights tailored to that area's data.</li>
          <li><strong>Collaboration and Sharing:</strong> Share interactive maps and AI-driven insights with your team, allowing for better decision-making and collaboration.</li>
        </ul>
        <p>
          This is just the beginning. We’re working on bringing cutting-edge AI technologies to transform how you interact with and analyze your commercial real estate investments. The future is interactive, intelligent, and powered by AiCRE’s AI capabilities.
        </p>
      </div>

      <style jsx>{`
        .map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .map-image {
          max-width: 100%; /* Ensures the image doesn't overflow */
          height: auto;
          margin-bottom: 20px;
          border-radius: 10px; /* Rounds the image corners */
          overflow: hidden; /* Ensures the rounded corners are applied to the image */
        }

        .description {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-top: 0;
          color: #333;
          font-size: 24px;
          font-weight: bold;
        }

        p {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }

        ul {
          text-align: left;
          margin: 20px auto;
          padding-left: 20px;
          list-style-type: disc;
          max-width: 600px;
        }

        ul li {
          margin-bottom: 10px;
          font-size: 15px;
          color: #444;
        }

        strong {
          color: #333;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .map-container {
            padding: 10px;
          }

          .description {
            padding: 15px;
          }

          ul {
            padding-left: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default IdealMap;
