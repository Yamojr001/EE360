# EE360 Farm API — Laravel 11 Backend

A standalone Laravel 11 REST API for the EE360 Farm Management System.  
Deploy this to your own VPS; the React frontend (Vercel) connects via `VITE_API_URL`.

---

## Requirements

| Tool    | Version |
|---------|---------|
| PHP     | ≥ 8.2   |
| Composer| ≥ 2.6   |
| MySQL   | ≥ 8.0 (or MariaDB ≥ 10.5) |
| Ubuntu  | 22.04 LTS recommended |

---

## VPS Setup (Ubuntu)

### 1. Install PHP 8.2

```bash
sudo apt update && sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql \
  php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-bcmath
```

### 2. Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 3. Install Nginx

```bash
sudo apt install -y nginx
```

### 4. Clone & configure

```bash
cd /var/www
git clone <your-repo-url> ee360-api
cd ee360-api/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Configure environment
cp .env.example .env
nano .env          # Fill in DB_* and FRONTEND_URL

# Generate app key
php artisan key:generate

# Run migrations + seed admin user
php artisan migrate --force
php artisan db:seed --force
```

### 5. Nginx configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/ee360-api/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ee360-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Storage permissions

```bash
sudo chown -R www-data:www-data /var/www/ee360-api/backend/storage
sudo chmod -R 775 /var/www/ee360-api/backend/storage
php artisan storage:link
```

### 7. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Default credentials

After seeding, login with:

| Field    | Value              |
|----------|--------------------|
| Email    | admin@ee360.farm   |
| Password | password           |

**Change the password immediately after first login!**

---

## API Overview

All routes are prefixed with `/api/` and (except login) require:  
`Authorization: Bearer <token>`

| Method | Path                    | Description                  |
|--------|-------------------------|------------------------------|
| POST   | /api/auth/login         | Get bearer token             |
| POST   | /api/auth/logout        | Revoke token                 |
| GET    | /api/dashboard/summary  | KPIs + chart data            |
| GET    | /api/livestock          | All animals                  |
| POST   | /api/livestock          | Add animal                   |
| PUT    | /api/livestock/{id}     | Update animal                |
| DELETE | /api/livestock/{id}     | Remove animal                |
| GET    | /api/sales              | All sales                    |
| POST   | /api/sales              | Record sale                  |
| DELETE | /api/sales/{id}         | Remove sale                  |
| GET    | /api/expenses           | All expenses                 |
| POST   | /api/expenses           | Add expense                  |
| DELETE | /api/expenses/{id}      | Remove expense               |
| GET    | /api/inventory          | All inventory items          |
| POST   | /api/inventory          | Add item                     |
| PUT    | /api/inventory/{id}     | Update item                  |
| DELETE | /api/inventory/{id}     | Remove item                  |
| GET    | /api/workers            | All workers                  |
| POST   | /api/workers            | Add worker                   |
| PUT    | /api/workers/{id}       | Update worker                |
| DELETE | /api/workers/{id}       | Remove worker                |
| GET    | /api/water/production   | Production log               |
| POST   | /api/water/production   | Log production               |
| DELETE | /api/water/production/{id} | Remove entry              |
| GET    | /api/water/sales        | Water sales log              |
| POST   | /api/water/sales        | Record water sale            |
| DELETE | /api/water/sales/{id}   | Remove entry                 |
| GET    | /api/reports/summary    | Full financial report        |

---

## Frontend (.env for Vercel)

Set this environment variable in your Vercel project settings:

```
VITE_API_URL=https://api.yourdomain.com/api
```

The React frontend will use this URL instead of the local proxy.
