# Excellence Entrepreneurship Academy - Implementation Guide

## Project Overview

A comprehensive, multi-tenant School & Farm Management System for Nigerian institutions. Supports student management, staff management, academic scheduling, financial tracking, and farm operations with offline-first capabilities.

**Status**: Phase 1 MVP - Authentication & Dashboard Foundation

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Offline**: Service Workers + IndexedDB + Background Sync

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes (MVP) → Express.js (Phase 2)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Auth**: JWT + httpOnly cookies
- **Validation**: Zod

### Deployment
- **Frontend**: Vercel (automatic from repo)
- **Backend**: Railway / Render (Phase 2)
- **Database**: Supabase / Neon (PostgreSQL)

---

## Current Architecture (Phase 1)

### Folder Structure

```
app/
├── (auth)/
│   └── login/                          # Login page
├── (dashboard)/
│   ├── layout.tsx                     # Protected dashboard layout
│   ├── dashboard/                     # Main dashboard
│   ├── school/                        # School operations
│   ├── farm/                          # Farm operations
│   └── finance/                       # Financial management
├── api/
│   └── auth/                          # Authentication endpoints
│       ├── login/
│       ├── logout/
│       ├── me/
│       └── refresh/
└── globals.css                        # Design tokens & theme

components/
├── dashboard/
│   ├── sidebar.tsx                    # Navigation sidebar
│   └── header.tsx                     # Top header with user menu
├── school/                            # School-specific components
├── farm/                              # Farm-specific components
└── ui/                                # shadcn/ui components (auto-generated)

lib/
├── auth.ts                            # JWT utilities
├── api-client.ts                      # Axios instance with offline support
└── utils.ts                           # Common utilities

prisma/
├── schema.prisma                      # Database schema (50+ tables)
└── migrations/                        # Database migrations

public/
└── (static assets)
```

### Database Schema (Prisma)

The system uses a multi-tenant architecture with schema isolation:

**Core Tables**:
- `tenants` - Institution/school data
- `users` - User accounts (students, teachers, parents, workers)
- `roles` - Role-based access control

**School Module**:
- `students` - Student records
- `staff` - Teachers and staff
- `classes` - Class groupings
- `subjects` - Academic subjects
- `timetables` - Class schedules
- `assignments` - Teacher assignments
- `exams` - Exam records
- `exam_results` - Student exam scores
- `student_transcripts` - Academic transcripts
- `school_fees` - Fee structure
- `fee_payments` - Payment tracking
- `school_expenses` - Expense tracking
- `financial_reports` - Monthly financial reports

**Farm Module**:
- `crops` - Crop types
- `farm_plots` - Farm land plots
- `crop_activities` - Farming activities (planting, weeding, etc.)
- `livestock` - Animal inventory
- `livestock_records` - Health/weight records
- `livestock_expenses` - Veterinary/feed costs
- `inventory_items` - Farm tools and supplies
- `fertilizers` - Fertilizer inventory
- `seeds` - Seed inventory
- `farm_workers` - Labor workforce
- `farm_tasks` - Work assignments
- `produce` - Harvest records
- `sales` - Produce sales
- `farm_expenses` - Farm operational costs
- `farm_revenue` - Revenue tracking
- `farm_metrics` - Production metrics

**Notifications & Audit**:
- `notifications` - User notifications
- `audit_logs` - System audit trail
- `system_logs` - Error/debug logs

---

## Authentication Flow

### Login Process

```
User → Login Form → /api/auth/login
    ↓
Verify credentials (backend/database)
    ↓
Create JWT tokens (access + refresh)
    ↓
Set httpOnly cookies
    ↓
Redirect to /dashboard
```

### Token Management

- **Access Token**: 30 minutes (JWT)
- **Refresh Token**: 7 days (JWT)
- **Storage**: httpOnly cookies (secure, not accessible to JS)
- **Automatic Refresh**: Interceptor on 401 response

### Protected Routes

Routes under `/dashboard` require valid authentication. The layout checks auth status on mount and redirects to `/login` if unauthenticated.

---

## Current Implementation Status

### ✅ Completed (Phase 1)

- [x] Prisma schema with 50+ tables
- [x] Multi-tenant architecture
- [x] JWT authentication system
- [x] Login/logout endpoints
- [x] Dashboard layout with sidebar
- [x] Main dashboard with charts
- [x] Design system (Tailwind theme)
- [x] API client with offline support scaffold
- [x] Environment configuration
- [x] Database connection setup

### ⏳ In Progress

- [ ] Student management CRUD
- [ ] Financial tracking (fees, payroll)
- [ ] Farm operations core features
- [ ] Offline sync (Service Workers + IndexedDB)
- [ ] Admin panel for multi-tenancy

### 📋 Todo (Phase 2-3)

- [ ] Academic features (assignments, exams, grades)
- [ ] Advanced farm tracking
- [ ] SMS notification system
- [ ] Parent/student portal
- [ ] AI-powered features (performance prediction, yield forecasting)
- [ ] Comprehensive testing & optimization

---

## Getting Started

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Set required variables
# DATABASE_URL - PostgreSQL connection string
# JWT_SECRET - Random string for JWT signing
# JWT_REFRESH_SECRET - Random string for refresh tokens
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (when ready with backend)
npm run prisma:migrate

# Optional: Open Prisma Studio
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with demo credentials:
- Email: `demo@excellence.edu`
- Password: `Demo@123`

---

## API Endpoints (MVP Phase)

### Authentication

```
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
GET    /api/auth/me                 - Get current user
POST   /api/auth/refresh            - Refresh access token
```

### School Module (To Be Implemented)

```
GET    /api/students                - List students
POST   /api/students                - Create student
GET    /api/students/:id            - Get student
PUT    /api/students/:id            - Update student
DELETE /api/students/:id            - Delete student

GET    /api/classes                 - List classes
POST   /api/classes                 - Create class

GET    /api/staff                   - List staff
POST   /api/staff                   - Create staff

GET    /api/exams                   - List exams
GET    /api/exam-results            - Get results
```

### Farm Module (To Be Implemented)

```
GET    /api/crops                   - List crops
POST   /api/crops                   - Add crop

GET    /api/livestock               - List livestock
POST   /api/livestock               - Add livestock

GET    /api/inventory               - List inventory
POST   /api/inventory               - Add item

GET    /api/farm-workers            - List workers
GET    /api/farm-tasks              - List tasks
```

### Finance Module (To Be Implemented)

```
GET    /api/school-fees             - List fees
GET    /api/fee-payments            - Payment history
GET    /api/payroll                 - Payroll records
GET    /api/financial-reports       - Financial reports
```

---

## Design System

### Color Palette

**Light Mode**:
- Primary: Teal (#10b981) - Growth & education
- Secondary: Blue (#0ea5e9) - Trust & stability
- Accent: Emerald (#06b6d4) - Energy & growth
- Foreground: Dark gray (#0f172a)
- Background: White (#ffffff)

**Dark Mode**:
- Primary: Light Teal (#60d5d5)
- Secondary: Light Blue (#a5d8ff)
- Accent: Emerald (#06b6d4)
- Foreground: Light gray (#f0f9ff)
- Background: Dark gray (#0f172a)

### Typography

- **Headings**: Geist (bold)
- **Body**: Geist (regular)
- **Mono**: Geist Mono (for code)

### Components

Uses shadcn/ui for consistent, accessible components:
- `Button` - Call-to-action buttons
- `Card` - Content containers
- `Input` - Form inputs
- `Select` - Dropdowns
- `Checkbox` / `Radio` - Form controls
- `Dialog` - Modals
- `Tabs` - Tabbed content
- `Avatar` - User profiles
- Charts from Recharts

---

## Development Roadmap

### Phase 1: MVP (Weeks 1-6) ✅ In Progress

**Week 1-2**: ✅ Complete
- Project setup
- Database schema
- Authentication system
- Dashboard layout

**Week 2-3**: Current
- Student management (CRUD)
- Classes management
- Staff management

**Week 3-4**:
- Timetables & scheduling
- Attendance tracking
- Basic results recording

**Week 4-5**:
- Crop management
- Livestock tracking
- Inventory system

**Week 5-6**:
- School fees & payments
- Payroll calculation
- Financial dashboard

### Phase 2: Enhanced Features (Weeks 7-10)

- Assignments & submissions
- Exam management & grading
- Student transcripts
- Teacher portal
- Farm yield tracking
- Produce sales management
- Parent portal access
- Advanced reporting

### Phase 3: Intelligence & Integration (Weeks 11-14)

- SMS notification system
- Performance prediction (AI)
- Yield forecasting (AI)
- Automated reports
- System optimization
- Load testing & deployment

---

## Offline-First Implementation (Phase 1.5)

### Architecture

```
Service Worker
├── Intercepts all API calls
├── Checks navigator.onLine
├── Routes to IndexedDB if offline
└── Queues changes for sync

IndexedDB
├── cache - Cached API responses
├── sync_queue - Pending changes
├── conflicts - Conflicted data
└── settings - Local preferences

Background Sync API
├── Registers for sync events
├── Retries failed requests
└── Handles conflict resolution
```

### Implementation Status

- [ ] Service Worker registration
- [ ] IndexedDB schema setup
- [ ] Cache strategy (Network-first for UI data, Cache-first for static)
- [ ] Sync queue management
- [ ] Conflict resolution logic

---

## Security Considerations

### Authentication

- ✅ JWT tokens with HS256 algorithm
- ✅ Refresh token rotation
- ✅ httpOnly cookies (immune to XSS)
- ✅ CSRF protection via SameSite cookies
- ⏳ Rate limiting on auth endpoints

### Data Protection

- ⏳ HTTPS/TLS encryption
- ⏳ Database encryption at rest
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention (React escaping)
- ⏳ Input validation & sanitization

### Multi-Tenancy

- ✅ Tenant ID in JWT
- ✅ Tenant middleware verification (to be implemented)
- ✅ Database schema isolation
- ⏳ Row-level security policies

---

## Common Tasks

### Adding a New API Endpoint

```typescript
// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('accessToken')?.value;
    const payload = await verifyToken(token || '');
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get tenantId from token
    const tenantId = payload.tenantId;

    // TODO: Query database
    // const students = await prisma.student.findMany({
    //   where: { tenantId }
    // });

    return NextResponse.json({
      success: true,
      data: [] // Return students
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### Adding a New Component

```typescript
// components/students/student-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function StudentForm() {
  const form = useForm();

  return (
    <form className="space-y-4">
      <Input placeholder="Student name" {...form.register('name')} />
      <Button type="submit">Create Student</Button>
    </form>
  );
}
```

---

## Troubleshooting

### "Unauthorized" on protected routes

- Check cookies in browser DevTools
- Verify JWT_SECRET matches between token creation and verification
- Ensure access token hasn't expired

### Database connection issues

- Verify DATABASE_URL in .env.local
- Check PostgreSQL service is running
- Confirm database credentials

### Styling issues

- Clear Next.js cache: `rm -rf .next`
- Rebuild Tailwind: Happens automatically
- Check design tokens in globals.css

---

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/student-management`
2. Follow existing code patterns
3. Test in browser before committing
4. Use descriptive commit messages
5. Keep components small and reusable

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs/
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Last Updated**: Phase 1 MVP - Authentication & Dashboard Foundation
**Next Phase**: Student Management & Financial Tracking
