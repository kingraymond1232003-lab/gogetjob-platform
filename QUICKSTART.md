# Quick Start Guide

## 🚀 Get Gogetjob Running in 5 Minutes

### Frontend Setup

#### Step 1: Clone & Install

```bash
git clone https://github.com/kingraymond1232003-lab/gogetjob-platform.git
cd gogetjob-platform
npm install
```

#### Step 2: Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ADMIN_SECRET_CODE=1232003
```

#### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

### Backend Setup

#### Step 1: Create Backend Directory

```bash
mkdir gogetjob-backend
cd gogetjob-backend
npm init -y
```

#### Step 2: Install Dependencies

```bash
npm install express cors dotenv bcryptjs jsonwebtoken pg multer sharp
npm install --save-dev nodemon
```

#### Step 3: Create `.env` File

```env
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gogetjob
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

ADMIN_SECRET_CODE=1232003
```

#### Step 4: Database Setup (PostgreSQL)

```bash
# Create database
creatdb -U postgres gogetjob

# Connect and run schema
psql -U postgres -d gogetjob -f schema.sql
```

#### Step 5: Create Basic Server

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### Step 6: Update `package.json`

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

#### Step 7: Start Backend

```bash
npm run dev
```

---

## 🔐 Admin Access

1. Go to http://localhost:5173
2. Click on search bar
3. Type: `1232003`
4. Press Enter → Redirected to Admin Sign-Up/Login
5. Create admin account

---

## 📝 Test Account Creation

### Worker Account

1. Click "Register"
2. Select "Worker"
3. Fill in details:
   - Name: Test Worker
   - Email: worker@test.com
   - Phone: +2349012345678
   - Password: Test123!
4. Click "Create Account"
5. Redirected to Worker Dashboard

### Employer Account

1. Click "Register"
2. Select "Employer"
3. Fill in details
4. Receive ₦300 credit limit for first job
5. Access Employer Dashboard

---

## 🎯 Key Features to Test

### Landing Page
- [x] Hero section with promotional badge
- [x] Dynamic stat counters
- [x] Live activity ticker (updates every 5 seconds)
- [x] How It Works section
- [x] Category cards with rates
- [x] Testimonials section
- [x] SEO content

### Worker Dashboard
- [x] View wallet balance and pending earnings
- [x] Withdrawal status banner (shows if bank/airtime window open)
- [x] Request withdrawal (only during open windows)
- [x] Referral program with unique link
- [x] Task history

### Employer Dashboard
- [x] Post new jobs with categories
- [x] App data size selection (with surcharges)
- [x] Payment method: Wallet or Credit
- [x] View credit account status
- [x] View posted jobs
- [x] Review worker submissions

### Admin Dashboard
- [x] View platform stats (commission, debts, etc.)
- [x] Manage categories and subcategories
- [x] Review pending tasks and set rates
- [x] Approve/reject deposits
- [x] Manage employer credit limits
- [x] View and resolve disputes
- [x] Add/edit platform bank accounts

---

## 🔑 Secret Admin Code

The secret code `1232003` in the search bar triggers admin access. This is hardcoded in:

- `src/components/NavBar.jsx` (search handler)
- `.env.local` (VITE_ADMIN_SECRET_CODE)

---

## 📦 Build for Production

### Frontend

```bash
npm run build
# Output in dist/ folder
```

### Backend

```bash
# Set NODE_ENV=production
NODE_ENV=production npm start
```

---

## 🐛 Troubleshooting

### "Cannot find module 'X'"

```bash
npm install
```

### "Port 3001 already in use"

```bash
# Change PORT in .env or kill process
kill -9 $(lsof -ti:3001)
```

### "Database connection failed"

```bash
# Check PostgreSQL is running
psql --version

# Verify credentials in .env
```

### "Frontend can't reach backend"

- Check backend is running on port 3001
- Verify CORS is enabled
- Check VITE_API_BASE_URL in .env.local

---

## 📚 Project Structure

```
gogetjob-platform/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores
│   ├── services/           # API calls
│   ├── App.jsx             # Main app
│   └── index.css           # Styles
├── index.html              # Entry point
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
├── package.json
├── .env.example
├── README.md
├── BACKEND_SETUP.md        # Backend guide
├── DATABASE_SCHEMA.md      # DB schema
└── API_DOCUMENTATION.md    # API docs
```

---

## 🚢 Deployment Platforms

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy dist/ folder to Vercel/Netlify
```

### Backend (Railway/Heroku/Render)

```bash
# Set environment variables on platform
# Connect git repo
# Auto-deploy on push
```

---

## 📖 Next Steps

1. ✅ Implement backend API endpoints (see API_DOCUMENTATION.md)
2. ✅ Set up PostgreSQL database
3. ✅ Configure JWT authentication
4. ✅ Implement image upload & hashing
5. ✅ Set up withdrawal window schedule
6. ✅ Add email notifications
7. ✅ Implement payment processing
8. ✅ Set up monitoring & logging

---

## 💡 Tips

- Test withdrawal windows: 
  - Friday 10 AM - Monday 10 AM: Airtime open
  - Monday 12 PM - Friday 12 PM: Bank open
- Credit limit starts at ₦300 per employer
- Admin can override any employer's credit limit (max ₦10,000)
- Worker gets paid only after employer approves submission
- Referral commission: 5% lifetime on all referred user tasks

---

## 🤝 Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review BACKEND_SETUP.md
3. Check console logs
4. Review database schema in DATABASE_SCHEMA.md

---

**Happy coding! 🎉**
