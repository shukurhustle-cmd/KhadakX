const path = require('path');

const root = path.resolve(__dirname, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'khakadx.s3.amazonaws.com'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react: path.join(root, 'node_modules/react'),
      'react-dom': path.join(root, 'node_modules/react-dom'),
    };
    return config;
  },
};

module.exports = nextConfig;
