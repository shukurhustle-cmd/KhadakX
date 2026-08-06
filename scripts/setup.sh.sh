#!/bin/bash

echo "🚀 Setting up KhadakX..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Installing..." >&2; npm install -g pnpm; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker is not installed. Some features may not work."; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup database
echo "🗄️  Setting up database..."
cd packages/db
pnpm generate
pnpm migrate
pnpm seed
cd ../..

# Build all packages
echo "🏗️  Building packages..."
pnpm build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  pnpm dev"
echo ""
echo "Or with Docker:"
echo "  docker-compose up -d"
echo ""
echo "Access points:"
echo "  Customer: http://localhost:3000"
echo "  Admin:    http://localhost:3001"
echo "  Kitchen:  http://localhost:3002"
echo "  Waiter:   http://localhost:3003"
echo "  POS:      http://localhost:3004"
echo "  API:      http://localhost:4000/api"