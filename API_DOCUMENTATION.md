# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Authentication Endpoints

### Register

**POST** `/auth/register`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+2349012345678",
  "password": "securepassword",
  "role": "worker" // or "employer"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "worker"
  },
  "token": "eyJhbGc..."
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Verify Token

**GET** `/auth/verify` (Protected)

Returns current user data if token is valid.

---

## Jobs Endpoints

### List Jobs

**GET** `/jobs?category=app&status=active&page=1&limit=20`

**Response:**

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Download App",
      "category": "app",
      "reward": 500,
      "remainingSlots": 10,
      "totalSlots": 50
    }
  ],
  "total": 100,
  "page": 1
}
```

### Get Job Details

**GET** `/jobs/:jobId`

### Create Job (Protected - Employer)

**POST** `/jobs`

```json
{
  "title": "Download and Review App",
  "categoryId": 1,
  "subcategoryId": 1,
  "appDataSize": "100 MB",
  "externalLink": "https://example.com",
  "description": "Download the app and submit a 5-star review",
  "proofRequired": true,
  "totalSlots": 50,
  "rewardPerSlot": 500,
  "paymentMethod": "wallet" // or "credit"
}
```

---

## Task Submission Endpoints

### Submit Proof (Protected - Worker)

**POST** `/jobs/:jobId/submit`

```json
{
  "proofText": "Proof description",
  "proofImage": "base64_encoded_image_or_url"
}
```

### Get Submissions (Protected - Employer)

**GET** `/jobs/:jobId/submissions`

Returns all submissions for a job.

### Approve Submission (Protected - Employer)

**POST** `/submissions/:submissionId/approve`

### Reject Submission (Protected - Employer)

**POST** `/submissions/:submissionId/reject`

```json
{
  "reason": "Screenshot does not show the app"
}
```

### Request Retry (Protected - Employer)

**POST** `/submissions/:submissionId/retry`

```json
{
  "notes": "Please retake screenshot with username visible"
}
```

### Dispute Rejection (Protected - Worker)

**POST** `/submissions/:submissionId/dispute`

```json
{
  "reason": "The proof was valid. Employer rejected unfairly."
}
```

---

## User Endpoints

### Get Profile (Protected)

**GET** `/users/profile`

### Update Profile (Protected)

**PUT** `/users/profile`

```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+2349012345678"
}
```

### Get Balance (Protected)

**GET** `/users/balance`

**Response:**

```json
{
  "walletBalance": 5000,
  "pendingBalance": 1500,
  "totalEarnings": 6500
}
```

### Get Referral Info (Protected)

**GET** `/users/referral`

**Response:**

```json
{
  "referralLink": "https://gogetjob.com/ref/abc123",
  "referralCode": "abc123",
  "referralsCount": 5,
  "signupBonusEarned": 250,
  "commissionEarned": 3500
}
```

---

## Withdrawal & Payout Endpoints

### Check Withdrawal Status

**GET** `/withdrawals/status`

**Response:**

```json
{
  "bankOpen": true,
  "airtimeOpen": false,
  "message": "Bank withdrawals are currently open..."
}
```

### Request Bank Withdrawal (Protected - Worker)

**POST** `/withdrawals/bank`

```json
{
  "amount": 5000,
  "bankName": "GTBank",
  "accountNumber": "0123456789",
  "accountName": "John Doe"
}
```

### Request Airtime (Protected - Worker)

**POST** `/withdrawals/airtime`

```json
{
  "amount": 2000,
  "phoneNumber": "+2349012345678",
  "network": "MTN" // MTN, Airtel, GLO, 9Mobile
}
```

### Get Withdrawal History (Protected)

**GET** `/withdrawals/history?limit=20&offset=0`

---

## Deposit Endpoints

### Get Admin Deposit Accounts

**GET** `/deposits/accounts`

**Response:**

```json
[
  {
    "id": 1,
    "bankName": "GTBank",
    "accountNumber": "0123456789",
    "accountName": "Gogetjob Limited"
  }
]
```

### Request Deposit (Protected - Employer)

**POST** `/deposits/request`

```json
{
  "amount": 10000,
  "bankName": "GTBank",
  "referenceNumber": "TRF123456",
  "proofUrl": "https://..."
}
```

### Get Deposit History (Protected)

**GET** `/deposits/history?limit=20`

---

## Admin Endpoints

### Get Admin Stats

**GET** `/admin/stats` (Protected - Admin)

**Response:**

```json
{
  "totalCommission": 50000,
  "pendingDeposits": 5,
  "pendingWithdrawals": 10,
  "totalEmployerDebt": 15000,
  "totalWorkers": 1000,
  "totalJobs": 500
}
```

### Get Pending Tasks

**GET** `/admin/tasks/pending` (Protected - Admin)

### Approve Task & Set Rate

**POST** `/admin/tasks/:taskId/approve` (Protected - Admin)

```json
{
  "workerRate": 420
}
```

Automatically calculates:
- Admin Commission = Employer Price - Worker Rate
- Worker receives 420 per completion
- Admin receives commission

### Reject Task

**POST** `/admin/tasks/:taskId/reject` (Protected - Admin)

```json
{
  "reason": "Task violates guidelines"
}
```

### Get Categories

**GET** `/admin/categories` (Protected - Admin)

### Create Category

**POST** `/admin/categories` (Protected - Admin)

```json
{
  "name": "Snapchat",
  "slug": "snapchat",
  "description": "Snapchat engagement tasks"
}
```

### Update Category

**PUT** `/admin/categories/:categoryId` (Protected - Admin)

### Delete Category

**DELETE** `/admin/categories/:categoryId` (Protected - Admin)

### Get Employer Credits

**GET** `/admin/employer-credits` (Protected - Admin)

Returns list of employers with outstanding debts.

### Update Credit Limit

**PUT** `/admin/employers/:employerId/credit-limit` (Protected - Admin)

```json
{
  "newLimit": 5000
}
```

Maximum limit: ₦10,000

### Get Pending Deposits

**GET** `/admin/deposits/pending` (Protected - Admin)

### Approve Deposit

**POST** `/admin/deposits/:depositId/approve` (Protected - Admin)

Automatically credits employer wallet.

### Get Disputes

**GET** `/admin/disputes` (Protected - Admin)

### Resolve Dispute

**POST** `/admin/disputes/:disputeId/resolve` (Protected - Admin)

```json
{
  "decision": "approved" // or "rejected",
  "notes": "Admin resolution notes"
}
```

---

## Error Codes

- `INVALID_CREDENTIALS` - Wrong email/password
- `TOKEN_EXPIRED` - JWT token has expired
- `INSUFFICIENT_BALANCE` - Not enough wallet balance
- `WITHDRAWAL_WINDOW_CLOSED` - Outside withdrawal hours
- `OUTSTANDING_DEBT` - Can't post job with unpaid credit
- `CREDIT_LIMIT_EXCEEDED` - Credit limit exceeded
- `DUPLICATE_SUBMISSION` - Duplicate proof detected
- `SLOT_FILLED` - No slots available
- `INVALID_FILE` - Invalid image file
- `RATE_LIMITED` - Too many requests

---

## Pagination

All list endpoints support:

- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (created_at, updated_at, etc.)
- `order` (asc, desc)

---

## Rate Limiting

- Login attempts: 5 per 15 minutes
- API calls: 100 per minute (authenticated)
- File uploads: 10 per hour

