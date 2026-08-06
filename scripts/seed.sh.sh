#!/bin/bash

echo "🌱 Seeding database..."

cd packages/db
pnpm seed

echo "✅ Seeding complete!"