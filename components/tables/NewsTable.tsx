import React, { useState, useEffect } from 'react';

interface NewsTableProps {
  newsType: 'national' | 'regional' | 'emerging'; // Type of news to fetch
  address?: string | null; // Optional address for regional news
}

interface NewsItem {
  title: string;
  text: string; // Article description
  image: string | null; // Article image
  url: string;
}

const NewsTable: React.FC<NewsTableProps> = ({ newsType, address = null }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeState, setFadeState] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  const fetchNews = async () => {
    try {
      let apiUrl = '';
      if (newsType === 'national') {
        apiUrl = '/api/news/national';
      } else if (newsType === 'regional') {
        apiUrl = '/api/news/regional';
      } else if (newsType === 'emerging') {
        apiUrl = '/api/news/emerging';
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('API fetch failed');
      }

      const data = await response.json();
      if (!data.articles || data.articles.length === 0) {
        fetchLocalNews();
      } else {
        setNewsItems(data.articles);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching from API, falling back to local JSON:', error);
      fetchLocalNews();
    }
  };

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
      setNewsItems(data.articles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching from local JSON:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [newsType]);

  useEffect(() => {
    if (newsItems.length > 1) {
      const interval = setInterval(() => {
        setFadeState('fadeOut');
        setTimeout(() => {
          setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
          setFadeState('fadeIn');
        }, 1000);
      }, 6000);
      return () => clearInterval(interval);
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
          background-color: #f9f9f9;
          padding: 8px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          font-size: 12px; /* Smaller font size */
          width: 100%; /* Full width of container */
          max-width: 600px; /* Adjust for desktop view */
          margin: auto;
        }

        .news-card h4 {
          font-size: 13px;
          margin-bottom: 6px;
        }

        .news-card h5 {
          font-size: 11px;
          margin-top: 4px;
          margin-bottom: 4px;
          color: #333;
        }

        .news-card p {
          font-size: 10px;
          color: #555;
          margin-bottom: 6px;
        }

        .news-image {
          width: 100%;
          height: 80px; /* Reduced height */
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 6px;
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

        a {
          font-size: 10px;
          color: #007bff;
        }

        @media (max-width: 768px) {
          .news-card {
            padding: 6px;
            max-width: 100%; /* Adjust to container width */
          }

          .news-card h4 {
            font-size: 12px;
          }

          .news-card h5 {
            font-size: 10px;
          }

          .news-card p {
            font-size: 9px;
          }

          .news-image {
            height: 70px; /* Smaller for tablets */
          }

          a {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .news-card {
            padding: 4px;
          }

          .news-card h4 {
            font-size: 11px;
          }

          .news-card h5 {
            font-size: 9px;
          }

          .news-card p {
            font-size: 8px;
          }

          .news-image {
            height: 60px; /* Smaller for mobile */
          }

          a {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTable;
