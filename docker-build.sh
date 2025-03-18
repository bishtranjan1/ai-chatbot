#!/bin/bash

# Exit on error
set -e

echo "==== Building Docker Images for RanjanchatAI ===="

# Build development image
echo "Building development image..."
docker build -t ranjan-ai-dev -f Dockerfile.dev .

# Build production image
echo "Building production image..."
docker build -t ranjan-ai-prod -f Dockerfile .

echo "==== Docker Images Built Successfully ===="
echo "You can now run:"
echo "  - Development: docker run -p 3000:3000 -v \$(pwd):/app -v /app/node_modules --env-file .env ranjan-ai-dev"
echo "  - Production: docker run -p 80:80 ranjan-ai-prod"
echo ""
echo "Or use docker-compose:"
echo "  - Development: docker-compose up app-dev"
echo "  - Production: docker-compose up app-prod" 