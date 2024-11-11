/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      // Development route for local testing
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:5328/api/:path*'
          : 'https://aicre-802945106465.us-west3.run.app/api/:path*', // GCP route
      },
      // AWS route
      {
        source: '/api/aws/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:5328/api/aws/:path*'
          : 'https://your-aws-service-url/:path*',
      },
      // Azure route
      {
        source: '/api/azure/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:5328/api/azure/:path*'
          : 'https://your-azure-service-url/:path*',
      }
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};

module.exports = nextConfig;
