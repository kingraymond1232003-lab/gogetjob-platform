# Deployment Guide

## Vercel (Frontend)

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output: `dist`
5. Add environment variables
6. Deploy!

### 3. Environment Variables on Vercel

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_ADMIN_SECRET_CODE=1232003
```

---

## Railway (Backend)

### 1. Connect Railway

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Select Node.js

### 2. Configure Environment

Add variables in Railway dashboard:

```
NODE_ENV=production
PORT=3001
DB_HOST=your_db_host
DB_NAME=gogetjob
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_SECRET_CODE=1232003
```

### 3. Create PostgreSQL Database

1. In Railway dashboard: "+ New"
2. Add PostgreSQL
3. Get connection string from Variables
4. Update DB_HOST, DB_USER, DB_PASSWORD

### 4. Deploy

```bash
# Push to trigger auto-deploy
git push origin main
```

---

## Heroku (Backend Alternative)

### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### 2. Create App

```bash
heroku create gogetjob-api
```

### 3. Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set ADMIN_SECRET_CODE=1232003
```

### 5. Deploy

```bash
git push heroku main
```

---

## AWS EC2 (Advanced)

### 1. Launch EC2 Instance

- AMI: Ubuntu 22.04
- Type: t3.micro or t3.small
- Security Groups: Allow ports 22, 80, 443, 3001

### 2. SSH into Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-dns
```

### 3. Install Dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql nginx
```

### 4. Clone Repository

```bash
git clone <your-repo-url>
cd gogetjob-platform
npm install
```

### 5. Configure PostgreSQL

```bash
sudo -u postgres createdb gogetjob
sudo -u postgres psql -d gogetjob -f schema.sql
```

### 6. Set Environment Variables

```bash
cp .env.example .env
# Edit .env with your settings
```

### 7. Start Application

```bash
# Using PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 save
```

### 8. Configure Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
upstream gogetjob_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name your-domain.com;

    location / {
        proxy_pass http://gogetjob_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9. Enable SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 10. Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## DigitalOcean App Platform

### 1. Connect GitHub

1. Go to DigitalOcean
2. Apps → Create App
3. Select GitHub repo
4. Configure resources

### 2. Add Database

1. Add component → PostgreSQL
2. Configure size (Basic: $15/month)

### 3. Environment Variables

Set in App Platform console

### 4. Deploy

Click "Deploy App"

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: gogetjob
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_NAME: gogetjob
      DB_USER: postgres
      DB_PASSWORD: postgres
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads

volumes:
  postgres_data:
```

### Run with Docker

```bash
docker-compose up -d
```

---

## Domain & DNS Setup

### 1. Register Domain

- Namecheap, GoDaddy, Google Domains, etc.

### 2. Point to Your Host

**For Vercel (Frontend):**
- Add CNAME: `<your-project>.vercel.app`

**For AWS/EC2:**
- Create A record pointing to EC2 public IP

**For DigitalOcean:**
- Add A record pointing to app IP

### 3. DNS Propagation

Wait 24-48 hours for DNS to propagate

---

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
```

### LogRocket (Frontend)

```bash
npm install logrocket
```

### PM2 Monitoring

```bash
pm2 install pm2-auto-pull
pm2 logrotate -u
```

---

## Performance Optimization

### Frontend

```bash
# Enable gzip compression
# Minify assets
# Use CDN for static files
# Lazy load components
```

### Backend

```bash
# Enable database query caching
# Use Redis for sessions
# Implement rate limiting
# Enable compression middleware
```

---

## SSL/HTTPS

### Vercel
- Automatic SSL

### Heroku
- Use `heroku-cli-ssl` plugin

### Let's Encrypt (EC2)

```bash
sudo certbot --nginx -d your-domain.com
```

---

## Backup Strategy

### Database Backups

```bash
# PostgreSQL
pg_dump -U postgres gogetjob > backup.sql

# Restore
psql -U postgres gogetjob < backup.sql
```

### Automated Backups

- AWS S3
- DigitalOcean Backups
- Heroku Postgres Backups

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      # Deploy to your platform
```

---

## Troubleshooting Deployments

### Frontend Not Loading

- Check build output
- Verify VITE_API_BASE_URL
- Check browser console

### Backend Connection Issues

- Check CORS settings
- Verify API URL in frontend
- Check firewall/security groups

### Database Connection Failed

- Verify connection string
- Check credentials
- Ensure database is running
- Check network access

---

## Cost Estimates (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Frontend | Free/$20+ | Free tier generous |
| Railway Backend | $5+ | Minimal usage |
| PostgreSQL DB | $5+ | Shared tier |
| Domain | $10-15 | Annual |
| **Total** | **$20-50** | **Minimal setup** |

---

## Security Checklist

- [ ] Use HTTPS/SSL
- [ ] Set strong JWT secret
- [ ] Hash passwords with bcryptjs
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Rate limit API endpoints
- [ ] Regular backups
- [ ] Monitor errors with Sentry
- [ ] Keep dependencies updated

---

**Ready to deploy! 🚀**
