#!/bin/bash

# Exit on error
set -e

# Function to display usage
usage() {
    echo "Usage: $0 [dev|prod] [--key GEMINI_API_KEY | --env ENV_FILE] [background]"
    echo ""
    echo "Options:"
    echo "  dev|prod        Run development or production container"
    echo "  --key KEY       Provide Gemini API key directly"
    echo "  --env FILE      Path to .env file (default: .env)"
    echo "  background      Run container in background (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 dev --key YOUR_GEMINI_API_KEY"
    echo "  $0 prod --env .env.production background"
    exit 1
}

# Check if environment type is provided
if [ $# -lt 1 ]; then
    usage
fi

ENV_TYPE=$1
shift

# Default values
ENV_FILE=".env"
BACKGROUND=""
API_KEY=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --key)
            API_KEY="$2"
            shift 2
            ;;
        --env)
            ENV_FILE="$2"
            shift 2
            ;;
        background)
            BACKGROUND="background"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Load environment file if it exists
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment from $ENV_FILE"
    export $(grep -v '^#' $ENV_FILE | xargs)
fi

# Override with command line API key if provided
if [ -n "$API_KEY" ]; then
    export REACT_APP_GEMINI_API_KEY="$API_KEY"
fi

# Check if API key is available
if [ -z "$REACT_APP_GEMINI_API_KEY" ]; then
    echo "Error: Gemini API key not provided. Use --key option or .env file."
    usage
fi

# Run the appropriate container
case $ENV_TYPE in
    dev)
        echo "==== Running RanjanchatAI Development Container ===="
        echo "Using Gemini API key: ${REACT_APP_GEMINI_API_KEY:0:5}...[hidden]"
        
        if [ "$BACKGROUND" = "background" ]; then
            echo "Running in background mode..."
            docker-compose up -d app-dev
        else
            docker-compose up app-dev
        fi
        ;;
    prod)
        echo "==== Running RanjanchatAI Production Container ===="
        echo "Using Gemini API key: ${REACT_APP_GEMINI_API_KEY:0:5}...[hidden]"
        
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