FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ssl/ /etc/nginx/ssl/
COPY   /build/browser /usr/share/nginx/html
