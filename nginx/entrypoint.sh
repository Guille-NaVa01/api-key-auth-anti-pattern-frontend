#!/bin/sh
# entrypoint.sh — Runs at container startup.
#
# Replaces the __API_KEY__ placeholder in nginx.conf with the real value
# of the $API_KEY environment variable, then starts Nginx.
#
# This keeps the secret out of the image layers and out of the browser.

set -e

if [ -z "$API_KEY" ]; then
  echo "ERROR: API_KEY environment variable is not set." >&2
  exit 1
fi

# Substitute the placeholder in the nginx config
sed -i "s/__API_KEY__/${API_KEY}/g" /etc/nginx/conf.d/default.conf

echo "Nginx config ready — starting server..."
exec nginx -g "daemon off;"
