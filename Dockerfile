# The site as last published on the gh-pages branch, served by nginx (unprivileged, port 8080).
# site/ is that branch, checked out by .github/workflows/release.yml (shared image.yml, pages: true) (the toolchain that built it is long outdated).
FROM nginxinc/nginx-unprivileged:1.30.4-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/
