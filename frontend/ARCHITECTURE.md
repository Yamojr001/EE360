# System Architecture - Excellence Academy Management System

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js 16 Frontend (React 19)                         │   │
│  │  - Student Dashboard                                     │   │
│  │  - Staff Portal                                          │   │
│  │  - Admin Dashboard                                       │   │
│  │  - Parent Portal (Future)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      OFFLINE LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Service Worker + IndexedDB                             │   │
│  │  - Network-first caching                                │   │
│  │  - Background sync                                       │   │
│  │  - Offline data persistence                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js Routes)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Authentication      │ Students      │ Finance           │   │
│  │  - /api/auth/login   │ - /api/...    │ - /api/...       │   │
│  │  - /api/auth/logout  │              │                   │   │
│  │  - /api/auth/me      │ Farm          │ Analytics         │   │
│  │  - /api/auth/refresh │ - /api/...    │ - /api/...       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Prisma ORM                                              │   │
│  │  - Type-safe database queries                            │   │
│  │  - Automatic migrations                                  │   │
│  │  - Relationship management                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                     │   │
│  │  (Multi-tenant with schema isolation)                    │   │
│  │                                                           │   │
│  │  Tables:                                                  │   │
│  │  - Users, Roles, Permissions (Auth)                      │   │
│  │  - Students, Classes, Grades (School)                    │   │
│  │  - Staff, Departments, Attendance (HR)                   │   │
│  │  - Crops, Livestock, Inventory (Farm)                    │   │
│  │  - Fees, Payments, Payroll (Finance)                     │   │
│  │  - Assignments, Exams (Academics)                        │   │
│  │  - AuditLog, Notifications (System)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components Hierarchy

```
RootLayout
├── AuthLayout
│   └── LoginPage
│       └── LoginForm
└── DashboardLayout
    ├── Header
    │   ├── Logo
    │   ├── SearchBar
    │   └── UserMenu
    ├── Sidebar
    │   └── NavItems (with role-based access)
    │       ├── Dashboard
    │       ├── School (Students, Staff, Attendance)
    │       ├── Academics (Assignments, Exams, Grades)
    │       ├── Finance (Fees, Payroll)
    │       ├── Farm (Crops, Livestock, Inventory, Workers)
    │       └── Analytics
    └── Main Content Area
        ├── StudentPage (with StudentForm, StudentList)
        ├── StaffPage (with StaffForm, StaffList)
        ├── AttendancePage (with AttendanceTable, Charts)
        ├── AssignmentPage (with AssignmentForm)
        ├── FinancePage (with FeeForm, PayrollForm)
        ├── FarmPage (with CropForm, InventoryForm)
        └── DashboardPage (with Analytics Charts)
```

---

## Data Flow Architecture

### Authentication Flow

```
User Input (Email/Password)
    ↓
LoginForm Component
    ↓
axios POST /api/auth/login
    ↓
API Route Handler
    ├── Validate credentials
    ├── Hash password check (bcrypt)
    └── Generate JWT tokens
    ↓
Response with tokens
    ↓
Store in httpOnly cookies
    ↓
Redirect to dashboard
    ↓
useAuth hook
    ├── Fetch /api/auth/me
    └── Load user context
```

### Data Persistence Flow (Offline-First)

```
User Action (Add/Edit/Delete)
    ↓
Form Submission
    ↓
Online Check
├── YES: POST to API → Database
│   └── On Success: Update IndexedDB
├── NO: Save to IndexedDB directly
│   └── Store sync queue
└── Cache Response
    ↓
Update Local State (Zustand)
    ↓
Rerender UI
    ↓
On Reconnection
    └── Background Sync
        ├── Process queue
        ├── Sync with server
        └── Resolve conflicts
```

### API Request/Response Flow

```
Client Component
    ↓
apiClient.post/get/put/delete()
    ↓
Check Online Status
    ├── Online: axios request
    ├── Offline: IndexedDB operation
    └── Return Promise
    ↓
API Route Handler (/app/api/*)
    ├── Verify JWT token
    ├── Check RBAC permissions
    ├── Validate input (Zod schema)
    ├── Database operation (Prisma)
    └── Return response/error
    ↓
Client Side
    ├── Cache in IndexedDB
    ├── Update state (Zustand/React Query)
    └── Trigger UI update
```

---

## Database Schema Overview

### Core Entity Relationships

```
User (Base)
├── Student
│   ├── StudentAttendance (M:M)
│   ├── StudentAssignment (M:M)
│   ├── StudentGrade (M:M)
│   └── Class (M:1)
├── Staff
│   ├── StaffAttendance (M:M)
│   ├── Class (teaches) (M:M)
│   ├── Department (M:1)
│   └── Payroll (1:M)
└── Parent
    ├── Student (M:M)
    └── Notifications (1:M)

Institution (Multi-tenant)
├── Class (1:M)
├── Department (1:M)
├── Crop (1:M)
├── Livestock (1:M)
├── FarmPlot (1:M)
├── Inventory (1:M)
├── SchoolFee (1:M)
└── AuditLog (1:M)

Subject (1:M)
├── Assignment (1:M)
├── Exam (1:M)
└── Grade (1:M)
```

---

## Authentication & Authorization

### JWT Token Structure

```
Header: {
  alg: "HS256",
  typ: "JWT"
}

Payload: {
  userId: "user_123",
  email: "user@excellence.edu",
  role: "admin",
  institution_id: "inst_456",
  permissions: ["students:read", "students:write", ...],
  iat: 1234567890,
  exp: 1234571490
}

Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Role-Based Access Control

```
Admin
├── All permissions
├── User management
├── Institution settings
└── Financial reports

Teacher
├── Students: read/write
├── Assignments: create/read/update
├── Grades: read/write
├── Attendance: read/write
└── Personal settings

Farm Manager
├── Crops: full access
├── Livestock: full access
├── Inventory: full access
├── Farm workers: read/write
└── Farm reports: read

Student
├── Profile: read/limited write
├── Assignments: read/submit
├── Grades: read
├── Attendance: read
└── Personal settings: write

Parent
├── Child profile: read
├── Child grades: read
├── Child attendance: read
└── Fees: read
```

---

## State Management Architecture

### Global State (Zustand)

```
useAuthStore
├── user
├── token
├── refreshToken
├── role
├── permissions
├── login(credentials)
├── logout()
└── refreshToken()

useOfflineStore
├── isOnline
├── syncQueue
├── addToQueue(operation)
├── processSyncQueue()
└── clearQueue()

useUIStore
├── sidebarOpen
├── theme (light/dark)
├── selectedClass
├── dateRange
└── toggleSidebar()
```

### Component State (React)

```
useForm (React Hook Form)
├── formState
├── handleSubmit
├── register
├── watch
└── getValues

useQuery (React Query)
├── data
├── isLoading
├── error
├── refetch
└── invalidateQueries

useState
├── Local component state
├── Form inputs (initial)
├── Modal open/close
└── Filter states
```

---

## Offline-First Architecture Details

### Service Worker Lifecycle

```
Installation
    ↓
Activate (cache cleanup)
    ↓
Fetch Interception
    ├── Network-first
    │   ├── Try network
    │   ├── Cache fallback
    │   └── Store response
    └── Cache-first
        ├── Try cache
        ├── Network fallback
        └── Update cache

Message Handling
    ├── Cache version
    ├── Skip waiting
    └── Background sync
```

### IndexedDB Schema

```
Database: excellence_academy

Stores:
├── students
│   ├── id (primary key)
│   ├── name
│   ├── email
│   ├── classId
│   └── _sync (metadata)
├── staff
├── attendance
├── assignments
├── crops
├── livestock
├── inventory
├── syncQueue
│   ├── id
│   ├── operation (create/update/delete)
│   ├── entity (students/staff/etc)
│   ├── data
│   ├── timestamp
│   └── retries
└── cache
    ├── key
    ├── value
    ├── timestamp
    └── ttl
```

---

## API Endpoint Architecture

### RESTful Conventions

```
Students:
  GET /api/students           # List all
  GET /api/students/:id       # Get one
  POST /api/students          # Create
  PUT /api/students/:id       # Update
  DELETE /api/students/:id    # Delete

Staff:
  GET /api/staff
  GET /api/staff/:id
  POST /api/staff
  PUT /api/staff/:id
  DELETE /api/staff/:id

[Similar patterns for all entities]

Authentication:
  POST /api/auth/login        # Login
  POST /api/auth/logout       # Logout
  GET /api/auth/me            # Current user
  POST /api/auth/refresh      # Refresh token
```

### Response Format

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    // entity data
  },
  "meta": {
    "timestamp": "2024-04-09T10:30:00Z",
    "version": "1.0"
  }
}
```

---

## Security Architecture

### Request Validation Pipeline

```
Incoming Request
    ↓
CORS Check
    ↓
Content-Type Validation
    ↓
JWT Authentication
    ├── Token presence
    ├── Token validity
    ├── Token expiration
    └── Token signature
    ↓
Role-Based Authorization
    ├── User role
    ├── Required permissions
    └── Resource ownership
    ↓
Input Validation (Zod)
    ├── Schema validation
    ├── Type checking
    └── Business logic validation
    ↓
Database Operation
    ├── Parameterized queries (Prisma)
    ├── SQL injection prevention
    └── Data-level access control
    ↓
Response
```

### Security Headers

```
CORS: Configured for same-origin or specific domains
CSP: Content Security Policy (to implement)
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────┐
│   Vercel (Frontend)             │
│   - Next.js deployment          │
│   - CDN for static assets       │
│   - Automatic SSL/HTTPS         │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Railway/Render (Backend)      │
│   - Node.js runtime             │
│   - Environment variables       │
│   - Auto-scaling                │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   PostgreSQL Database           │
│   - Managed service             │
│   - Automated backups           │
│   - SSL encryption              │
└─────────────────────────────────┘
```

### CI/CD Pipeline

```
Git Push
    ↓
GitHub Actions
    ├── Lint checks
    ├── Type checking
    ├── Build verification
    └── Test suite
    ↓
Automated Deployment
    ├── Frontend to Vercel
    ├── Backend to Railway/Render
    └── Database migrations (if any)
    ↓
Health Checks
    ├── API availability
    ├── Database connectivity
    └── Service status
```

---

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ├── API Server 1
    ├── API Server 2
    ├── API Server 3
    └── API Server N
        ↓
    Shared PostgreSQL
    (Connection pooling)
```

### Database Optimization

```
Indexing Strategy:
├── User.email (unique)
├── Student.classId
├── Staff.departmentId
├── Crop.institutionId
└── Attendance.(studentId, date)

Query Optimization:
├── Eager loading relationships
├── Pagination for large datasets
├── Caching frequent queries
└── Database connection pooling
```

---

## Performance Optimization Strategy

### Frontend

```
Code Splitting
├── Route-based splitting
├── Component lazy loading
└── Dynamic imports

Caching
├── Static assets (long TTL)
├── API responses (IndexedDB)
└── Service Worker caching

Image Optimization
├── WebP format
├── Responsive images
└── Lazy loading
```

### Backend

```
Query Optimization
├── Database indexing
├── Select specific columns
├── Eager load relationships
└── Pagination

Caching
├── Redis for session storage
├── Query result caching
├── File cache for reports
└── CDN for static files
```

---

## Monitoring & Logging

### Metrics to Track

```
Performance
├── API response time
├── Database query time
├── Frontend load time
└── Service Worker performance

Usage
├── Active users
├── Requests per hour
├── Error rates
└── Feature usage

System Health
├── CPU/Memory usage
├── Database connections
├── Disk space
└── Network bandwidth
```

### Logging Strategy

```
Error Logs
├── API errors
├── Database errors
├── Authentication failures
└── Sync failures

Access Logs
├── User logins
├── Resource access
├── Data modifications
└── Failed attempts

Audit Logs
├── Data changes
├── User actions
├── System changes
└── Export/Download activities
```

---

This architecture ensures scalability, security, offline capability, and maintainability for the Excellence Academy Management System.
