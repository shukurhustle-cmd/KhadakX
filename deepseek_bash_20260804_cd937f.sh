#!/bin/bash

echo "🔍 Verifying KhadakX Project Structure..."
echo "=========================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if file exists and has content
check_file() {
    local file=$1
    if [ -f "$file" ]; then
        if [ -s "$file" ]; then
            echo -e "${GREEN}✅ $file exists and has content${NC}"
        else
            echo -e "${RED}❌ $file exists but is empty${NC}"
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
    fi
}

# Check all critical files
echo ""
echo "📁 Root Files:"
check_file "docker-compose.yml"
check_file ".env.example"
check_file "README.md"

echo ""
echo "📁 Backend Files:"
check_file "apps/api/package.json"
check_file "apps/api/tsconfig.json"
check_file "apps/api/.env"
check_file "apps/api/Dockerfile"
check_file "apps/api/src/main.ts"
check_file "apps/api/src/app.module.ts"

echo ""
echo "📁 Backend Modules:"
check_file "apps/api/src/whatsapp/whatsapp.controller.ts"
check_file "apps/api/src/whatsapp/whatsapp.module.ts"
check_file "apps/api/src/menu/menu.controller.ts"
check_file "apps/api/src/menu/menu.module.ts"
check_file "apps/api/src/orders/orders.controller.ts"
check_file "apps/api/src/orders/orders.module.ts"
check_file "apps/api/src/ai/ai.service.ts"
check_file "apps/api/src/ai/ai.module.ts"

echo ""
echo "📁 Frontend Files:"
check_file "apps/web/package.json"
check_file "apps/web/next.config.js"
check_file "apps/web/tailwind.config.js"
check_file "apps/web/postcss.config.js"
check_file "apps/web/.env.local"
check_file "apps/web/Dockerfile"

echo ""
echo "📁 Frontend App:"
check_file "apps/web/app/layout.tsx"
check_file "apps/web/app/page.tsx"
check_file "apps/web/app/globals.css"
check_file "apps/web/app/admin/page.tsx"
check_file "apps/web/app/table/[id]/page.tsx"

echo ""
echo "📁 Components:"
check_file "apps/web/components/Cart.tsx"
check_file "apps/web/components/ARViewer.tsx"

echo ""
echo "📁 Database:"
check_file "packages/db/schema.prisma"

echo ""
echo "=========================================="
echo "✅ Verification Complete!"