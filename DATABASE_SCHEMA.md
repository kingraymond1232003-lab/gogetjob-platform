# Database Schema Documentation

## Complete SQL Schema for Gogetjob Platform

### Core Tables

#### Users (Workers, Employers, Admins)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('worker', 'employer', 'admin') NOT NULL,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  pending_balance DECIMAL(15,2) DEFAULT 0,
  credit_balance_owed DECIMAL(15,2) DEFAULT 0,
  credit_limit DECIMAL(15,2) DEFAULT 0,
  bank_code VARCHAR(10),
  account_number VARCHAR(20) UNIQUE,
  account_name VARCHAR(255),
  referrer_id INT REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_account ON users(account_number);
```

#### Categories

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

#### Subcategories

```sql
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_subcategories_category ON subcategories(category_id);
```

#### App Data Size Pricing

```sql
CREATE TABLE app_data_size_tiers (
  id SERIAL PRIMARY KEY,
  size_label VARCHAR(50) NOT NULL UNIQUE,
  min_size_mb INT,
  max_size_mb INT,
  surcharge DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO app_data_size_tiers (size_label, min_size_mb, max_size_mb, surcharge) VALUES
('Less than 50 MB', 0, 49, 0),
('50 MB', 50, 50, 50),
('60 MB', 60, 60, 100),
('70 MB', 70, 70, 150),
('100 MB', 100, 100, 250),
('200 MB Above', 200, 999999, 500);
```

#### Jobs/Tasks

```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  employer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id),
  subcategory_id INT NOT NULL REFERENCES subcategories(id),
  title VARCHAR(500) NOT NULL,
  app_data_size VARCHAR(50),
  app_data_size_tier_id INT REFERENCES app_data_size_tiers(id),
  image_url VARCHAR(500),
  external_link VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  proof_required BOOLEAN DEFAULT false,
  employer_price_per_slot DECIMAL(10,2) NOT NULL,
  worker_payout_rate DECIMAL(10,2),
  admin_commission_per_slot DECIMAL(10,2),
  total_slots INT NOT NULL,
  remaining_slots INT NOT NULL,
  completed_slots INT DEFAULT 0,
  is_credit_job BOOLEAN DEFAULT false,
  credit_paid_back BOOLEAN DEFAULT false,
  status ENUM('pending_admin_review', 'active', 'paused', 'completed', 'rejected', 'expired') DEFAULT 'pending_admin_review',
  admin_rejection_reason TEXT,
  admin_approved_at TIMESTAMP,
  admin_approved_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);
```

#### Task Submissions

```sql
CREATE TABLE task_submissions (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proof_text TEXT,
  proof_image_url VARCHAR(500),
  image_hash VARCHAR(64),
  status ENUM('pending_review', 'approved', 'rejected', 'retry_requested', 'disputed') DEFAULT 'pending_review',
  rejection_reason TEXT,
  retry_notes TEXT,
  retry_count INT DEFAULT 0,
  is_disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_job ON task_submissions(job_id);
CREATE INDEX idx_submissions_worker ON task_submissions(worker_id);
CREATE INDEX idx_submissions_status ON task_submissions(status);
CREATE INDEX idx_submissions_image_hash ON task_submissions(image_hash);
CREATE UNIQUE INDEX idx_submissions_unique_hash ON task_submissions(image_hash) WHERE image_hash IS NOT NULL;
```

#### Referrals & Commissions

```sql
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE,
  signup_bonus_paid BOOLEAN DEFAULT false,
  signup_bonus_amount DECIMAL(10,2) DEFAULT 50,
  total_commission_earned DECIMAL(15,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referrer_id, referred_user_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);
```

#### Referral Commission Ledger

```sql
CREATE TABLE referral_commissions (
  id SERIAL PRIMARY KEY,
  referral_id INT NOT NULL REFERENCES referrals(id),
  submission_id INT NOT NULL REFERENCES task_submissions(id),
  commission_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissions_referral ON referral_commissions(referral_id);
```

#### Withdrawal & Airtime Requests

```sql
CREATE TABLE payout_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('bank_withdrawal', 'airtime_purchase') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  destination_bank VARCHAR(100),
  destination_account VARCHAR(20),
  destination_account_name VARCHAR(255),
  phone_number VARCHAR(20),
  airtime_network VARCHAR(50),
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  admin_notes TEXT,
  processed_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_user ON payout_requests(user_id);
CREATE INDEX idx_payouts_status ON payout_requests(status);
CREATE INDEX idx_payouts_type ON payout_requests(type);
CREATE INDEX idx_payouts_created ON payout_requests(created_at DESC);
```

#### Deposit Requests

```sql
CREATE TABLE deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  proof_url VARCHAR(500),
  reference_number VARCHAR(100),
  bank_name VARCHAR(100),
  transaction_date TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  approved_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deposits_user ON deposit_requests(user_id);
CREATE INDEX idx_deposits_status ON deposit_requests(status);
CREATE INDEX idx_deposits_created ON deposit_requests(created_at DESC);
```

#### Admin Deposit Accounts

```sql
CREATE TABLE admin_deposit_accounts (
  id SERIAL PRIMARY KEY,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  bank_code VARCHAR(10),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Disputes

```sql
CREATE TABLE disputes (
  id SERIAL PRIMARY KEY,
  submission_id INT NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
  worker_id INT NOT NULL REFERENCES users(id),
  employer_id INT NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status ENUM('pending', 'resolved', 'closed') DEFAULT 'pending',
  resolution TEXT,
  admin_decision ENUM('approved', 'rejected', 'partial_payout'),
  resolved_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disputes_submission ON disputes(submission_id);
CREATE INDEX idx_disputes_status ON disputes(status);
```

#### Admin Commission Ledger

```sql
CREATE TABLE admin_commission_ledger (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id),
  submission_id INT NOT NULL REFERENCES task_submissions(id),
  employer_charged DECIMAL(10,2) NOT NULL,
  worker_paid DECIMAL(10,2) NOT NULL,
  admin_commission DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_job ON admin_commission_ledger(job_id);
CREATE INDEX idx_ledger_created ON admin_commission_ledger(created_at DESC);
```

#### Audit Log

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INT,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

## Key Constraints & Business Rules

1. **Unique Account Numbers**: Prevent multiple users from withdrawing to same bank account
2. **Image Hash Uniqueness**: Prevent duplicate proof submissions
3. **Email & Phone Uniqueness**: One account per email and phone
4. **Referral Constraints**: Users can't refer themselves
5. **Job Slot Logic**: Slots only decrease on approved submissions
6. **Credit Blocking**: Employers with debt can't post new jobs
7. **Maximum Credit Limit**: Hard cap at ₦10,000 per employer

## Database Initialization Script

Run this to set up a fresh database:

```bash
psql -U postgres -d gogetjob -f schema.sql
```

Then seed initial data:

```bash
node scripts/seed-db.js
```
