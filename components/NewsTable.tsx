import React, { useState, useEffect } from 'react';

interface NewsTableProps {
  newsType: 'national' | 'regional' | 'emerging'; // Type of news to fetch
  address?: string | null; // Optional address for regional news
}

interface NewsItem {
  title: string;
  text: string; // Webz.io API's 'text' field for article description
  image: string | null; // Webz.io API's 'image' field
  url: string;
}

const NewsTable: React.FC<NewsTableProps> = ({ newsType, address = null }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeState, setFadeState] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  const fetchLocalNews = async () => {
    try {
      let localUrl = '';
      if (newsType === 'national') {
        localUrl = '/news/national.json';
      } else if (newsType === 'regional') {
        localUrl = '/news/regional.json';
      } else if (newsType === 'emerging') {
        localUrl = '/news/emerging.json';
      }

      const response = await fetch(localUrl);
      const data = await response.json();
      setNewsItems(data.articles || []); // Set the fallback news items
      setLoading(false);
    } catch (error) {
      console.error('Error fetching from local JSON:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch local JSON data when component mounts or when newsType changes
    fetchLocalNews();
  }, [newsType]);

  useEffect(() => {
    // Automatically cycle through news items with fade effect
    if (newsItems.length > 1) {
      const interval = setInterval(() => {
        setFadeState('fadeOut'); // Start fade out
        setTimeout(() => {
          setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length); // Switch news
          setFadeState('fadeIn'); // Start fade in
        }, 1000); // Duration of the fade out before switching to the next news item
      }, 6000); // Total duration for each news item (5 seconds visible, 1 second fade)

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [newsItems]);

  const currentNewsItem = newsItems[currentNewsIndex];

  return (
    <div className="news-card">
      <h4>{newsType === 'national' ? 'National News' : newsType === 'regional' ? 'Portfolio News' : 'Emerging Markets'}</h4>

      {loading ? (
        <p>Loading news...</p>
      ) : currentNewsItem ? (
        <div className={`news-content ${fadeState}`}>
          {currentNewsItem.image && (
            <img
              src={currentNewsItem.image}
              alt={currentNewsItem.title}
              className="news-image"
            />
          )}
          <h5>{currentNewsItem.title}</h5>
          <p>{currentNewsItem.text}</p>
          <a href={currentNewsItem.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ) : (
        <p>No news available.</p>
      )}

      <style jsx>{`
        .news-card {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .news-card h4 {
          font-size: 18px;
          margin-bottom: 12px;
        }

        .news-card h5 {
          font-size: 16px;
          margin-top: 10px;
          margin-bottom: 10px;
          color: #333;
        }

        .news-card p {
          font-size: 14px;
          color: #555;
        }

        .news-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .news-content {
          opacity: 1;
          transition: opacity 1s ease-in-out;
        }

        .news-content.fadeOut {
          opacity: 0;
        }

        .news-content.fadeIn {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .news-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTable;
