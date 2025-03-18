#!/bin/bash

# Exit on error
set -e

# Function to display usage
usage() {
    echo "Usage: $0 [dev|prod] [background]"
    echo ""
    echo "Options:"
    echo "  dev         Run development container"
    echo "  prod        Run production container"
    echo "  background  Run container in background (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Run development container in foreground"
    echo "  $0 prod         # Run production container in foreground"
    echo "  $0 dev background # Run development container in background"
    exit 1
}

# Check if environment type is provided
if [ $# -lt 1 ]; then
    usage
fi

ENV_TYPE=$1
BACKGROUND=$2

case $ENV_TYPE in
    dev)
        echo "==== Running RanjanchatAI Development Container ===="
        if [ "$BACKGROUND" = "background" ]; then
            echo "Running in background mode..."
            docker-compose up -d app-dev
        else
            docker-compose up app-dev
        fi
        ;;
    prod)
        echo "==== Running RanjanchatAI Production Container ===="
        if [ "$BACKGROUND" = "background" ]; then
            echo "Running in background mode..."
            docker-compose up -d app-prod
        else
            docker-compose up app-prod
        fi
        ;;
    *)
        echo "Invalid environment type: $ENV_TYPE"
        usage
        ;;
esac 