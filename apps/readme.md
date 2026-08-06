# 🍽️ KhadakX Restaurant Experience OS

A WhatsApp-first restaurant platform with LiveMenu, WebAR, loyalty, AI waiter, kitchen display, admin dashboard, and analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use the Docker one)

### Installation

```bash
# Clone and enter
git clone <your-repo>
cd khakadx

# Install dependencies
cd apps/api && npm install
cd ../web && npm install

# Setup database
cd ../../packages/db
npx prisma generate
npx prisma migrate dev --name init

# Start the app
docker-compose up -d