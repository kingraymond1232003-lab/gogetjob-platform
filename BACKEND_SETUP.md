# Backend Setup Guide for Gogetjob Platform

## Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local storage or AWS S3
- **Email**: Nodemailer or SendGrid

## Quick Start

### 1. Initialize Node Project

```bash
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken axios multer sharp
npm install --save-dev nodemon
```

### 2. Create `.env` File

```env
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gogetjob
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Admin
ADMIN_SECRET_CODE=1232003

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 3. Basic Express Server Structure

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/withdrawals', require('./routes/withdrawals'));
app.use('/api/deposits', require('./routes/deposits'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. Database Connection

For PostgreSQL with `pg` library:

```bash
npm install pg
```

Create `db.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('worker', 'employer', 'admin') NOT NULL,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  credit_balance_owed DECIMAL(15,2) DEFAULT 0,
  credit_limit DECIMAL(15,2) DEFAULT 0,
  bank_code VARCHAR(10),
  account_number VARCHAR(20),
  account_name VARCHAR(255),
  referrer_id INT REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
```

### Categories Table

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subcategories Table

```sql
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subcategories_category ON subcategories(category_id);
```

### Jobs Table

```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  employer_id INT NOT NULL REFERENCES users(id),
  category_id INT NOT NULL REFERENCES categories(id),
  subcategory_id INT NOT NULL REFERENCES subcategories(id),
  title VARCHAR(255) NOT NULL,
  app_data_size VARCHAR(50),
  image_url VARCHAR(500),
  external_link VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  proof_required BOOLEAN DEFAULT false,
  employer_price_per_slot DECIMAL(10,2) NOT NULL,
  worker_payout_rate DECIMAL(10,2),
  admin_commission_per_slot DECIMAL(10,2),
  total_slots INT NOT NULL,
  remaining_slots INT NOT NULL,
  is_credit_job BOOLEAN DEFAULT false,
  status ENUM('pending_review', 'active', 'completed', 'rejected') DEFAULT 'pending_review',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
```

### Task Submissions Table

```sql
CREATE TABLE task_submissions (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id),
  worker_id INT NOT NULL REFERENCES users(id),
  proof_text TEXT,
  proof_image_url VARCHAR(500),
  image_hash VARCHAR(64),
  status ENUM('pending', 'approved', 'rejected', 'retry_requested', 'disputed') DEFAULT 'pending',
  rejection_reason TEXT,
  retry_notes TEXT,
  is_disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_job ON task_submissions(job_id);
CREATE INDEX idx_submissions_worker ON task_submissions(worker_id);
CREATE INDEX idx_submissions_status ON task_submissions(status);
CREATE UNIQUE INDEX idx_submissions_image_hash ON task_submissions(image_hash) WHERE image_hash IS NOT NULL;
```

### Referrals Table

```sql
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INT NOT NULL REFERENCES users(id),
  referred_user_id INT NOT NULL REFERENCES users(id),
  signup_bonus_paid BOOLEAN DEFAULT false,
  total_commission_earned DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);
```

### Payout Requests Table

```sql
CREATE TABLE payout_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  type ENUM('bank_withdrawal', 'airtime') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  destination_details VARCHAR(500),
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_user ON payout_requests(user_id);
CREATE INDEX idx_payouts_status ON payout_requests(status);
CREATE INDEX idx_payouts_type ON payout_requests(type);
```

### Deposit Requests Table

```sql
CREATE TABLE deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  amount DECIMAL(15,2) NOT NULL,
  proof_url VARCHAR(500),
  reference_number VARCHAR(100),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deposits_user ON deposit_requests(user_id);
CREATE INDEX idx_deposits_status ON deposit_requests(status);
```

### Admin Deposit Accounts Table

```sql
CREATE TABLE admin_deposit_accounts (
  id SERIAL PRIMARY KEY,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Disputes Table

```sql
CREATE TABLE disputes (
  id SERIAL PRIMARY KEY,
  submission_id INT NOT NULL REFERENCES task_submissions(id),
  worker_id INT NOT NULL REFERENCES users(id),
  employer_id INT NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status ENUM('pending', 'resolved') DEFAULT 'pending',
  resolution TEXT,
  resolved_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disputes_submission ON disputes(submission_id);
CREATE INDEX idx_disputes_status ON disputes(status);
```

### Commission Ledger Table

```sql
CREATE TABLE commission_ledger (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id),
  submission_id INT NOT NULL REFERENCES task_submissions(id),
  commission_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_job ON commission_ledger(job_id);
```

## Key Implementation Notes

### 1. Authentication Flow

- Hash passwords using `bcryptjs`
- Generate JWT tokens on login
- Include JWT in all protected requests via Authorization header
- Verify JWT on each protected route

### 2. Withdrawal Schedule Logic

```javascript
function getWithdrawalStatus() {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();

  // Friday 10 AM - Monday 10 AM: Airtime window
  const isFridayToMonday = (day === 5 && hours >= 10) || day === 6 || (day === 0 && hours < 10);
  
  // Monday 12 PM - Friday 12 PM: Bank window
  const isMondayToFriday = (day === 0 && hours >= 12) || (day >= 1 && day <= 4) || (day === 5 && hours < 12);

  return { bankOpen: isMondayToFriday, airtimeOpen: isFridayToMonday };
}
```

### 3. Image Hash Verification

```javascript
const crypto = require('crypto');
const fs = require('fs');

function getImageHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}
```

### 4. Commission Calculation

When a task is approved:

```javascript
const adminCommission = employerPrice - workerRate;
// Admin commission goes to commission ledger
// Worker rate goes to worker wallet
// Job slot count decreases by 1
```

### 5. Credit Job Blocking Logic

```javascript
// When creating a job:
if (employer.creditBalanceOwed > 0) {
  throw new Error('You have outstanding debt. Pay it off to post more jobs.');
}
```

## API Endpoint Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Submissions
- `POST /api/jobs/:jobId/submit` - Submit proof
- `GET /api/jobs/:jobId/submissions` - Get submissions
- `POST /api/submissions/:id/approve` - Approve submission
- `POST /api/submissions/:id/reject` - Reject submission
- `POST /api/submissions/:id/retry` - Request retry
- `POST /api/submissions/:id/dispute` - Dispute rejection

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/balance` - Get wallet balance
- `GET /api/users/referral` - Get referral info

### Withdrawals & Deposits
- `POST /api/withdrawals/bank` - Request bank withdrawal
- `POST /api/withdrawals/airtime` - Request airtime
- `GET /api/withdrawals/status` - Check withdrawal window status
- `POST /api/deposits/request` - Request deposit
- `GET /api/deposits/accounts` - Get admin bank accounts

### Admin
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/tasks/pending` - Pending tasks
- `POST /api/admin/tasks/:id/approve` - Approve task
- `POST /api/admin/deposits/:id/approve` - Approve deposit
- `GET /api/admin/employer-credits` - List employer credits
- `PUT /api/admin/employers/:id/credit-limit` - Update credit limit
- `GET /api/admin/disputes` - List disputes
- `POST /api/admin/disputes/:id/resolve` - Resolve dispute
- `GET /api/admin/stats` - Get admin stats

## Running the Backend

```bash
# Development
npm run dev

# Production
NODE_ENV=production npm start
```

## Security Best Practices

1. Use HTTPS in production
2. Validate all inputs
3. Use parameterized queries to prevent SQL injection
4. Hash passwords with bcryptjs
5. Implement rate limiting on sensitive endpoints
6. Use CORS properly
7. Validate JWT tokens on every protected route
8. Store sensitive data in environment variables
9. Implement logging and monitoring
10. Regular security audits

## Testing

```bash
npm install --save-dev jest supertest
```

Create test files in `__tests__` directory.

## Deployment

Recommended platforms:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Ensure environment variables are set on your hosting platform.
