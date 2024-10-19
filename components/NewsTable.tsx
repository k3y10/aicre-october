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

// Create a counter to track how many API calls have been made
let apiCallCount = 0;
const MAX_API_CALLS = 3; // Limit to 3 API calls

const NewsTable: React.FC<NewsTableProps> = ({ newsType, address = null }) => {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Access the Webz.io API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_WEBZ_KEY;

  const fetchNewsData = async () => {
    setLoading(true);

    try {
      // Check if the API call count has reached the limit
      if (apiCallCount >= MAX_API_CALLS) {
        throw new Error('API call limit reached');
      }

      let url = '';
      if (newsType === 'national') {
        url = `https://api.webz.io/newsApiLite?token=${apiKey}&q=United%20States`;
      } else if (newsType === 'regional' && address) {
        const regionalQuery = address.split(' ').join('%20');
        url = `https://api.webz.io/newsApiLite?token=${apiKey}&q=${regionalQuery}`;
      } else if (newsType === 'emerging') {
        url = `https://api.webz.io/newsApiLite?token=${apiKey}&q=emerging%20markets`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setNewsItem(data.articles[0] || null);
        apiCallCount++; // Increment the API call count
      } else {
        throw new Error(data.message || 'Error fetching news data');
      }
    } catch (error) {
      console.error('Error fetching from API. Falling back to static JSON:', error);
      // If API call fails, fall back to local JSON
      await fetchLocalNews();
    } finally {
      setLoading(false);
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
      setNewsItem(data.articles[0] || null); // Set the fallback news item
    } catch (error) {
      console.error('Error fetching from local JSON:', error);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, [newsType, address]);

  return (
    <div className="news-card">
      <h4>{newsType === 'national' ? 'National News' : newsType === 'regional' ? 'Regional News' : 'Emerging Markets'}</h4>
      {loading ? (
        <p>Loading news...</p>
      ) : newsItem ? (
        <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
          {newsItem.image && (
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="news-image"
            />
          )}
          <h5>{newsItem.title}</h5>
          <p>{newsItem.text}</p>
        </a>
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
