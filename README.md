# Gogetjob Platform - Mobile-First Web App

Nigeria's #1 Verified Earning Platform. Earn real money online with simple daily tasks.

## Features

### 🎯 For Workers
- Browse and complete micro-tasks
- Earn money from apps, social media, surveys, and website tasks
- Withdraw via bank transfer or airtime
- Referral program with 5% lifetime commission
- Flexible weekly withdrawal schedule

### 💼 For Employers
- Post jobs and tasks quickly
- Job on credit system (starter limit: ₦300)
- Review and approve worker submissions
- Admin-driven rate setting and commission system
- Manual bank deposit system

### 🛡️ For Admins
- Secret code access via search bar (1232003)
- Full website editing control
- Category and pricing management
- Task review and approval system
- Employer credit limit management
- Deposit and withdrawal processing
- Dispute resolution center
- Revenue tracking and reporting

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS (Mobile-first)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**: Custom Tailwind components

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout.jsx
│   ├── NavBar.jsx
│   ├── ProtectedRoute.jsx
│   └── LiveActivityTicker.jsx
├── pages/            # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── dashboard/
│       ├── WorkerDashboard.jsx
│       ├── EmployerDashboard.jsx
│       └── admin/AdminDashboard.jsx
├── store/            # Zustand stores
│   ├── authStore.js
│   └── categoryStore.js
├── services/         # API services
│   └── api.js
├── App.jsx          # Main app component
├── index.css        # Global styles
└── main.jsx         # Entry point
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kingraymond1232003-lab/gogetjob-platform.git
cd gogetjob-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your API base URL and configuration.

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Admin Access

1. Navigate to the homepage
2. Click on the search bar
3. Type the secret code: `1232003`
4. Press Enter to access the Admin Sign-Up/Login page

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Key Features Implemented

### Landing Page
- Hero section with promotional badge
- Dynamic stat counters
- Live activity ticker with real-time updates
- 3-step how it works section
- Category rate cards grid
- Testimonials and social proof
- SEO-optimized keyword content

### Authentication
- Worker and Employer registration
- Role-based login
- Protected routes
- Token-based authentication

### Worker Dashboard
- Job/task completion tracking
- Wallet balance display
- Weekly withdrawal schedule with live status
- Referral program widget
- Task history with filtering

### Employer Dashboard
- Job creation with categories and data sizes
- Credit system with configurable limits
- Payment method selection (wallet or credit)
- Submission review interface
- Outstanding debt tracking

### Admin Dashboard
- Full category CRUD operations
- Task review and approval with rate setting
- Deposit approval queue
- Employer credit limit management
- Dispute resolution center
- Platform bank account management
- Revenue and stats dashboard

## Database Schema

The platform uses the following core tables:

- **Users**: Worker, Employer, and Admin accounts
- **Categories**: Main task categories
- **Subcategories**: Category subdivisions
- **Jobs**: Task postings
- **Task Submissions**: Worker proof submissions
- **Referrals**: Referral tracking
- **Payout Requests**: Withdrawal/airtime requests
- **Admin Deposit Accounts**: Platform bank details

## API Endpoints

All API calls are made through `/services/api.js`. The backend should implement:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify token

### Jobs
- `GET /jobs` - List jobs
- `POST /jobs` - Create job
- `GET /jobs/:id` - Get job details

### Admin
- `GET /admin/categories` - List categories
- `POST /admin/categories` - Create category
- `GET /admin/tasks/pending` - Pending tasks for review
- `POST /admin/tasks/:id/approve` - Approve task
- `POST /admin/deposits/:id/approve` - Approve deposit

## Security Features

- JWT token-based authentication
- Secure password hashing
- Role-based access control
- Image hash verification to prevent duplicate proofs
- Unique bank account enforcement
- Secret admin code protection

## Mobile-First Responsive Design

- Mobile-optimized navigation (hamburger menu)
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for small screens first
- Progressive enhancement for larger screens

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For issues and support, please contact the development team.

---

**Made with ❤️ for Nigeria's Digital Economy**
