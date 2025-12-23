#!/bin/bash

echo "🚀 Starting Cursor Editor..."
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# 启动服务
echo "✨ Starting development servers..."
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:3001"
echo ""

npm run dev
