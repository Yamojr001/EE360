# Excellence Entrepreneurship Academy

## 🎓 School & Farm Management System

A comprehensive, multi-tenant platform for Nigerian educational institutions to manage student records, academic operations, financial tracking, and farm operations all in one integrated system.

**Status**: Phase 1 MVP - Authentication & Dashboard Foundation ✅

---

## ✨ Features

### School Management
- 📚 Student registration and profile management
- 👥 Staff and teacher management
- 📅 Class scheduling and timetable management
- 📝 Assignment and assessment tracking
- 📊 Exam management and grade recording
- 📄 Student transcripts and reports

### Farm Operations
- 🌾 Crop planning and lifecycle tracking
- 🐄 Livestock inventory and health records
- 📦 Farm inventory management (seeds, fertilizers, tools)
- 👨‍🌾 Farm worker management and task assignment
- 📈 Produce tracking and sales management
- 💰 Farm expense and revenue tracking

### Financial Management
- 💳 School fees tracking and payment management
- 💰 Staff and worker payroll calculation
- 📊 Financial reporting and analytics
- 💵 Income and expense tracking
- 📈 Revenue forecasting and budgeting

### Multi-Tenancy
- 🏢 Multiple institution support in single system
- 🔒 Complete data isolation between institutions
- 👤 Role-based access control (Admin, Teacher, Student, Parent, Farm Manager, Worker)
- 📱 Responsive design for mobile access

### Offline-First
- 📡 Works in low-internet environments (Nigerian context)
- 🔄 Automatic background sync when connected
- 💾 Local data caching with IndexedDB
- 📋 Service Worker-based offline support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 14+ (for production)
- pnpm or npm

### Setup

1. **Clone & Install**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # Update with your values:
   # - DATABASE_URL (PostgreSQL connection)
   # - JWT_SECRET (random string for JWT)
   # - NEXT_PUBLIC_API_URL (API base URL)
   ```

3. **Database Setup** (when backend is ready)
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Login**
   - Visit `http://localhost:3000/login`
   - Use demo credentials:
     - **Email**: `demo@excellence.edu`
     - **Password**: `Demo@123`

---

## 📁 Project Structure

```
excellence-academy/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Auth pages (login, register)
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── dashboard/           # Main dashboard
│   │   ├── school/              # School operations
│   │   ├── farm/                # Farm operations
│   │   └── finance/             # Financial management
│   ├── api/                     # API routes
│   │   └── auth/                # Authentication endpoints
│   └── layout.tsx               # Root layout
├── components/
│   ├── dashboard/               # Dashboard components
│   ├── school/                  # School-specific components
│   ├── farm/                    # Farm-specific components
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   ├── api-client.ts            # API client with offline support
│   └── utils.ts                 # Utility functions
├── prisma/
│   ├── schema.prisma            # Database schema (50+ tables)
│   └── migrations/              # Database migrations
├── public/                      # Static assets
└── styles/                      # Global styles & CSS

Key Files:
- IMPLEMENTATION_GUIDE.md        # Detailed implementation guide
- API documentation in code comments
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- Next.js 16 (React 19)
- Tailwind CSS 4
- shadcn/ui components
- TypeScript
- Recharts (for analytics)

**Backend**:
- Next.js API Routes (MVP)
- Prisma ORM
- PostgreSQL
- JWT authentication
- Multi-tenant schema isolation

**Deployment**:
- Vercel (frontend)
- Railway/Render (backend, Phase 2)
- Supabase/Neon (database)

### Database

The system uses a sophisticated multi-tenant PostgreSQL database with 50+ tables organized into modules:

**Core**: Tenants, Users, Roles, Audit Logs
**School**: Students, Staff, Classes, Subjects, Timetables, Assignments, Exams, Grades, Transcripts
**Finance**: School Fees, Payments, Expenses, Payroll, Reports
**Farm**: Crops, Plots, Livestock, Inventory, Workers, Tasks, Produce, Sales
**Notifications**: User notifications, System logs

---

## 🔐 Authentication

The system uses JWT-based authentication with refresh token rotation:

- **Access Token**: 30 minutes (httpOnly cookie)
- **Refresh Token**: 7 days (httpOnly cookie)
- **Automatic Refresh**: On 401 responses
- **CSRF Protection**: SameSite cookies
- **Multi-Tenant**: Tenant ID in JWT payload

---

## 📊 Dashboard Features

The main dashboard provides:
- 📈 Key metrics (students, staff, revenue, attendance)
- 📉 Financial trends (revenue vs expenses chart)
- 🎓 Student distribution by class
- 📋 Recent registrations
- ⚠️ Pending actions and alerts
- 🔔 Notifications

---

## 🛣️ Development Roadmap

### Phase 1: MVP ✅ In Progress (Weeks 1-6)
- [x] Database schema & multi-tenancy setup
- [x] Authentication system (login/logout/refresh)
- [x] Dashboard layout & navigation
- [x] Dashboard analytics page
- [ ] Student management CRUD
- [ ] Financial tracking (fees, payroll)
- [ ] Farm operations core
- [ ] Offline-first architecture

### Phase 2: Enhanced Features (Weeks 7-10)
- [ ] Assignments & exam management
- [ ] Student transcripts & reports
- [ ] Teacher portal
- [ ] Farm yield tracking
- [ ] Parent & student portals
- [ ] Advanced reporting

### Phase 3: Intelligence & Scale (Weeks 11-14)
- [ ] SMS notifications (Twilio/Termii)
- [ ] AI predictions (student performance, farm yield)
- [ ] System optimization & caching
- [ ] Load testing
- [ ] Production deployment

### Phase 4: Advanced Features (Future)
- [ ] Mobile apps (iOS/Android with Expo)
- [ ] Advanced multi-tenancy (billing, custom branding)
- [ ] Third-party integrations
- [ ] Business intelligence dashboard

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
GET    /api/auth/me                 - Get current user
POST   /api/auth/refresh            - Refresh access token
```

### School Module (To Be Implemented)
```
GET/POST   /api/students            - List/create students
GET/PUT    /api/students/:id        - Get/update student
DELETE     /api/students/:id        - Delete student

GET/POST   /api/classes             - Classes management
GET/POST   /api/staff               - Staff management
GET/POST   /api/exams               - Exam management
GET        /api/exam-results        - Get exam results
```

### Farm Module (To Be Implemented)
```
GET/POST   /api/crops               - Crop management
GET/POST   /api/livestock           - Livestock management
GET/POST   /api/inventory           - Inventory management
GET/POST   /api/farm-workers        - Worker management
```

### Finance Module (To Be Implemented)
```
GET/POST   /api/school-fees         - Fee management
GET        /api/fee-payments        - Payment history
GET        /api/payroll             - Payroll records
GET        /api/financial-reports   - Financial reports
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#10b981) - Growth & education
- **Secondary**: Blue (#0ea5e9) - Trust
- **Accent**: Emerald (#06b6d4) - Energy
- **Foreground**: Dark gray/white
- **Background**: White/dark gray

### Components
All UI components are from shadcn/ui, providing:
- ✅ Accessible (WCAG AA)
- ✅ Customizable
- ✅ Responsive
- ✅ Dark mode support

---

## 🔒 Security

### Authentication & Authorization
- JWT tokens with secure algorithm
- httpOnly cookies (XSS protection)
- Refresh token rotation
- Role-based access control
- Tenant isolation in JWT

### Data Protection
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping)
- CSRF protection (SameSite cookies)
- Input validation (Zod)
- Audit logging for sensitive operations

### Multi-Tenancy
- Schema isolation per institution
- Tenant ID verification
- Row-level security (planned)
- Secure data separation

---

## 🧪 Testing

Run tests (when implemented):
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## 📱 Offline Functionality

The application includes offline-first capabilities for low-internet environments:

- **Service Workers**: Intercept requests and cache responses
- **IndexedDB**: Local data storage for offline access
- **Background Sync**: Queue changes and sync when online
- **Conflict Resolution**: Handle data conflicts intelligently

Currently in MVP phase - full implementation in Phase 1.5.

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Automatic deployment on push
# Just connect your GitHub repo to Vercel
```

### Backend (Railway/Render)
```bash
# Coming in Phase 2
# Will use Express.js separate from Next.js API routes
```

### Database (Supabase/Neon)
```bash
# PostgreSQL managed hosting
# Set DATABASE_URL in environment
```

---

## 📖 Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed technical guide
- **[API Routes Documentation](#api-endpoints)** - API endpoint reference
- **[Prisma Schema](./prisma/schema.prisma)** - Database schema documentation

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/student-management`
2. Make your changes
3. Test in development: `npm run dev`
4. Commit: `git commit -m "feat: add student management"`
5. Push: `git push origin feature/student-management`
6. Create a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Review existing code and comments
3. Create an issue with detailed description

---

## 📝 License

This project is proprietary software for Excellence Entrepreneurship Academy.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Recharts](https://recharts.org/)

---

## 🎯 Current Focus

**Phase 1 MVP**: Building core authentication, dashboard, and basic student management.

**Next Steps**:
1. Complete student management CRUD operations
2. Implement financial tracking (fees, payroll)
3. Add farm module core features
4. Integrate offline-first architecture
5. Build admin panel for multi-tenancy

**Get Started**: `npm install && npm run dev`

**Demo Login**: demo@excellence.edu / Demo@123

---

*Last Updated: Phase 1 MVP - Foundation Complete*
