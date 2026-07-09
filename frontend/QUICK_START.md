# Quick Start Guide - Excellence Academy Management System

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/excellence_academy"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 3: Start Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### Step 4: Login
```
Email: demo@excellence.edu
Password: Demo@123
```

---

## Available Routes

### Authentication
- `GET /login` - Login page
- `POST /api/auth/login` - Login API
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `POST /api/auth/refresh` - Refresh token

### Dashboard
- `GET /dashboard` - Main dashboard

### School Module
- `GET /dashboard/school/students` - Students list
- `GET /dashboard/school/staff` - Staff directory
- `GET /dashboard/school/attendance` - Attendance marking

### Academics
- `GET /dashboard/academics/assignments` - Assignment management
- `GET /dashboard/academics/exams` - Exam management

### Finance
- `GET /dashboard/finance/fees` - School fees
- `GET /dashboard/finance/payroll` - Payroll management

### Farm
- `GET /dashboard/farm/crops` - Crop management
- `GET /dashboard/farm/livestock` - Livestock management
- `GET /dashboard/farm/inventory` - Inventory management
- `GET /dashboard/farm/workers` - Farm workers

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database (when setup)
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed demo data
```

---

## Project Structure

```
excellence-academy/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utilities
├── hooks/                 # Custom hooks
├── prisma/                # Database schema
├── public/                # Static files
└── documentation/         # Project docs
```

---

## Default Credentials

For testing purposes:
```
Email: demo@excellence.edu
Password: Demo@123
```

---

## Features Available

✅ Student Management
✅ Staff Management
✅ Attendance Tracking
✅ Assignment Management
✅ School Fee Tracking
✅ Payroll Management
✅ Crop Planning
✅ Livestock Tracking
✅ Inventory Management
✅ Farm Worker Management
✅ Analytics Dashboard
✅ Offline-First Support

---

## Database Setup (Optional for MVP)

If you want to use a real database:

### PostgreSQL (Local)
```bash
# Install PostgreSQL
# Create database
createdb excellence_academy

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/excellence_academy"

# Run migrations
npm run prisma:migrate
```

### PostgreSQL (Cloud Options)
- **Railway**: https://railway.app
- **Render**: https://render.com
- **AWS RDS**: https://aws.amazon.com/rds
- **Vercel Postgres**: https://vercel.com/postgres

---

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Database Connection Issues
```bash
# Check DATABASE_URL in .env.local
# Verify PostgreSQL is running
# Test connection: psql $DATABASE_URL
```

### Prisma Client Issues
```bash
npm run prisma:generate
npm run build
```

---

## Next Steps

1. **Explore the UI**: Log in and navigate through different modules
2. **Review the Code**: Check components in `components/` folder
3. **Understand Architecture**: Read `IMPLEMENTATION_GUIDE.md`
4. **Set Up Database**: Follow database setup instructions
5. **Deploy**: Use Vercel for frontend, Railway/Render for backend

---

## Documentation Files

- **README.md** - Project overview and API reference
- **SETUP.md** - Detailed setup instructions
- **IMPLEMENTATION_GUIDE.md** - Technical architecture details
- **DEVELOPER_REFERENCE.md** - Code patterns and utilities
- **PROJECT_STATUS.md** - Complete deliverables list
- **PHASE1_SUMMARY.md** - What was built and next steps

---

## Support

For issues or questions:
1. Check the documentation files
2. Review code comments
3. Check console for error messages
4. Review `.env.example` for missing variables

---

## Demo Video Script

```
1. Show login page
2. Login with demo credentials
3. Show main dashboard with analytics
4. Navigate to Students - demonstrate add/edit/delete
5. Navigate to Staff - show directory
6. Navigate to Attendance - demonstrate marking
7. Navigate to Assignments - show creation
8. Navigate to Finance - show fee tracking
9. Navigate to Farm - show operations
10. Show mobile responsiveness
```

---

Happy building! 🎓🌾
