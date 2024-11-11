import React, { useState, useEffect } from 'react';

interface NewsTableProps {
  newsType: 'national' | 'regional' | 'emerging'; // Type of news to fetch
}

interface NewsItem {
  title: string;
  url: string; // Updated field to match the dataset for URL
  image?: string; // Added for optional image URL
}

const NewsTable: React.FC<NewsTableProps> = ({ newsType }) => {
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

      // Ensure `data.articles` is typed as `NewsItem[]`
      const data: { articles: NewsItem[] } = await response.json();

      // Remove duplicates based on the title
      const uniqueNewsItems = Array.from(
        new Map(data.articles.map((item) => [item.title, item])).values()
      );

      setNewsItems(uniqueNewsItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
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
    <div className="news-table">
      <h4>{newsType === 'national' ? 'National News' : newsType === 'regional' ? 'Regional News' : 'Emerging Markets'}</h4>

      {loading ? (
        <p>Loading news...</p>
      ) : currentNewsItem ? (
        <div className={`news-content ${fadeState}`}>
          {currentNewsItem.image && <img src={currentNewsItem.image} alt={currentNewsItem.title} className="news-image" />}
          <a href={currentNewsItem.url} target="_blank" rel="noopener noreferrer">
            <p className="news-title">{currentNewsItem.title}</p>
          </a>
        </div>
      ) : (
        <p>No news available.</p>
      )}

      <style jsx>{`
        .news-table {
          background-color: #f9f9f9;
          padding: 10px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          font-size: 12px;
          width: 100%; /* Full width of container */
        }

        .news-table h4 {
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .news-content {
          transition: opacity 1s ease-in-out;
        }

        .news-content.fadeOut {
          opacity: 0;
        }

        .news-content.fadeIn {
          opacity: 1;
        }

        .news-image {
          width: 100%;
          height: auto;
          max-height: 150px; /* Increased max height for better quality */
          border-radius: 4px;
          margin-bottom: 5px;
          object-fit: contain; /* Prevents distortion */
        }

        .news-title {
          font-size: 12px;
          color: #007bff;
          text-decoration: none;
        }

        .news-title:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .news-table {
            max-width: 100%;
          }

          .news-title {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .news-title {
            font-size: 10px;
          }

          .news-image {
            max-height: 100px; /* Smaller max height for mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTable;
