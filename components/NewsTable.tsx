import React, { useState, useEffect } from 'react';

interface NewsTableProps {
  newsType: 'national' | 'regional' | 'emerging'; // Type of news to fetch
  address?: string | null; // Optional address for regional news
}

interface NewsItem {
  title: string;
  description: string;
  urlToImage: string | null;
  url: string;
}

const NewsTable: React.FC<NewsTableProps> = ({ newsType, address = null }) => {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      let url = '';
      if (newsType === 'national') {
        url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
      } else if (newsType === 'regional' && address) {
        const regionalQuery = address.split(' ').join('+');
        url = `https://newsapi.org/v2/everything?q=${regionalQuery}&apiKey=${apiKey}`;
      } else if (newsType === 'emerging') {
        url = `https://newsapi.org/v2/everything?q=emerging+markets&apiKey=${apiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setNewsItem(data.articles[0] || null);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
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
      ) : (
        newsItem ? (
          <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
            {newsItem.urlToImage && (
              <img src={newsItem.urlToImage} alt={newsItem.title} className="news-image" />
            )}
            <h5>{newsItem.title}</h5>
            <p>{newsItem.description}</p>
          </a>
        ) : (
          <p>No news available.</p>
        )
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
