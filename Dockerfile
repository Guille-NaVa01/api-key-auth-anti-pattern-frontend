# ── Build stage is not needed (no compilation) ────────────────────────────────
FROM nginx:alpine

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config (with __API_KEY__ placeholder)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files
COPY index.html  /usr/share/nginx/html/index.html
COPY styles.css  /usr/share/nginx/html/styles.css
COPY app.js      /usr/share/nginx/html/app.js

# Copy and prepare the entrypoint script
COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
