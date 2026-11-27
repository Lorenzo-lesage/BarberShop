# syntax=docker/dockerfile:1

# ============================================================
# Base: PHP 8.4 + PHP-FPM + Nginx (serversideup/php, Debian)
# Gira come www-data, ascolta su 8080. Multi-arch (amd64/arm64).
# ============================================================
FROM serversideup/php:8.4-fpm-nginx AS base

USER root
# GD per Intervention Image (resize + conversione WebP)
RUN install-php-extensions gd
USER www-data


# ============================================================
# Stage 1 — dipendenze PHP (vendor senza pacchetti dev)
# ============================================================
FROM base AS vendor

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

# Prima solo i file di Composer: questo layer resta in cache finché il lock non cambia
COPY --chown=www-data:www-data composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY --chown=www-data:www-data . .
# Genera l'autoloader ottimizzato ed esegue package:discover (solo provider di produzione)
RUN composer dump-autoload --optimize --no-dev --no-interaction


# ============================================================
# Stage 2 — asset frontend (tsc + vite build)
# ============================================================
FROM node:24-slim AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# tsconfig risolve "ziggy-js" dentro vendor/tightenco/ziggy
COPY --from=vendor /var/www/html/vendor/tightenco/ziggy ./vendor/tightenco/ziggy

# Le VITE_* finiscono nel JS pubblico: solo valori non segreti
ARG VITE_APP_NAME=BarberShop
ENV VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build


# ============================================================
# Stage finale — immagine di produzione
# ============================================================
FROM base AS production

ENV PHP_OPCACHE_ENABLE=1 \
    HEALTHCHECK_PATH=/up \
    TRUSTED_PROXY=local \
    AUTORUN_ENABLED=true

COPY --from=vendor --chown=www-data:www-data /var/www/html /var/www/html
COPY --from=assets --chown=www-data:www-data /app/public/build /var/www/html/public/build
