#!/bin/bash
set -e

# Replace environment variables in the built JS files
if [ -n "$REACT_APP_GEMINI_API_KEY" ]; then
  echo "Setting Gemini API key in application..."
  find /usr/share/nginx/html -name "*.js" -exec sed -i "s/REACT_APP_GEMINI_API_KEY=.*\"/REACT_APP_GEMINI_API_KEY=$REACT_APP_GEMINI_API_KEY\"/g" {} \;
fi

# Add any other environment variable replacements here
# For example:
# if [ -n "$REACT_APP_SOME_OTHER_VAR" ]; then
#   echo "Setting SOME_OTHER_VAR in application..."
#   find /usr/share/nginx/html -name "*.js" -exec sed -i "s/REACT_APP_SOME_OTHER_VAR=.*\"/REACT_APP_SOME_OTHER_VAR=$REACT_APP_SOME_OTHER_VAR\"/g" {} \;
# fi

# Create runtime config file for environment-specific settings
echo "window.RUNTIME_CONFIG = {" > /usr/share/nginx/html/runtime-config.js
if [ -n "$REACT_APP_GEMINI_API_KEY" ]; then
  echo "  GEMINI_API_KEY: '$REACT_APP_GEMINI_API_KEY'," >> /usr/share/nginx/html/runtime-config.js
fi
echo "  BUILD_DATE: '$(date)'" >> /usr/share/nginx/html/runtime-config.js
echo "};" >> /usr/share/nginx/html/runtime-config.js

echo "Starting application..."
exec "$@" 