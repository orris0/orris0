#!/bin/bash

echo "🚀 Starting DevCoreX Environment Setup..."

# 1. Ensure absolute path mapping to avoid folder conflicts
WORKSPACE_DIR="$HOME/devcorex-workspace"
PROJECT_DIR="$WORKSPACE_DIR/web-project"

# 2. Check for dependency updates inside the web application folder
if [ -d "$PROJECT_DIR" ]; then
    echo "📦 Auditing Node.js project folders..."
    cd "$PROJECT_DIR"
    if [ ! -d "node_modules" ]; then
        echo "⚠️ Missing node_modules! Restoring dependencies..."
        npm install
    fi
else
    echo "❌ Error: web-project directory not found!"
    exit 1
fi

# 3. Boot background processes (Redis Cache server)
echo "💾 Initializing persistent Redis session cache..."
redis-server --daemonize yes 2>/dev/null || echo "ℹ️ Redis is already listening."

# 4. Fire up the backend engine process
echo "🟢 Launching Node.js Framework application..."
node "$PROJECT_DIR/server.js" &
NODE_PID=$!

# 5. Initialize code-server IDE environment web panel
echo "💻 Activating code-server IDE window..."
echo "🔗 Access your code suite via browser at http://127.0.0.1:8080"
code-server --bind-addr 127.0.0.1:8080 --auth none

# Cleanup background server process when terminal environment exits
kill $NODE_PID
