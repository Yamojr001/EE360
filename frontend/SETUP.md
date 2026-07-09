# Excellence Entrepreneurship Academy - Setup Guide

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
# or if you use pnpm:
pnpm install
```

This installs all required packages including:
- Next.js 16
- React 19
- Tailwind CSS
- shadcn/ui
- Prisma
- JWT libraries

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
# Database (configure when ready)
DATABASE_URL="postgresql://user:password@localhost:5432/excellence_academy"

# JWT Secrets (use random strings)
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3000
```

**For Development**: You can use the demo credentials without a real database. The app will use mock data.

### Step 3: Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### Step 4: Login

Navigate to `http://localhost:3000/login` and use:
- **Email**: `demo@excellence.edu`
- **Password**: `Demo@123`

---

## 🗄️ Database Setup (Optional for MVP)

### Using Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the PostgreSQL connection string
4. Paste into `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/postgres"
   ```

5. Setup database:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Create database
   npm run prisma:migrate -- --name init
   
   # Optional: seed with sample data
   npm run prisma:seed
   ```

### Using Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy connection string
4. Configure `.env.local`
5. Run migrations as above

### Local PostgreSQL

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb excellence_academy

# Update .env.local
DATABASE_URL="postgresql://localhost/excellence_academy"

# Run migrations
npm run prisma:migrate -- --name init
```

---

## 📁 Project Structure Overview

```
app/                 - Next.js pages and API routes
├── (auth)/         - Authentication pages
├── (dashboard)/    - Protected dashboard pages
└── api/            - API endpoints

components/        - React components
├── dashboard/     - Dashboard UI components
├── school/        - School module components
├── farm/          - Farm module components
└── ui/            - shadcn/ui components

lib/               - Utility libraries
├── auth.ts        - JWT and auth helpers
├── api-client.ts  - API client with offline support
└── utils.ts       - Common utilities

prisma/            - Database
├── schema.prisma  - Data models
└── migrations/    - Database migrations

public/            - Static files
styles/            - CSS and Tailwind config
```

---

## 🔧 Available Commands

```bash
# Development
npm run dev                  # Start dev server

# Build
npm run build               # Build for production
npm start                   # Start production server

# Database
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run database migrations
npm run prisma:studio       # Open Prisma data studio
npm run prisma:seed         # Seed database (when implemented)

# Linting
npm run lint                # Run ESLint

# Testing (when implemented)
npm test                    # Run tests
npm run test:watch          # Run tests in watch mode
```

---

## 🌐 Accessing the Application

### Local Development
- **Frontend**: `http://localhost:3000`
- **Login Page**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard`

### Demo Credentials
- **Email**: `demo@excellence.edu`
- **Password**: `Demo@123`

---

## 📊 What You Can Do Now (MVP Phase 1)

✅ **Working Features**:
- Login/logout system
- Dashboard with analytics
- View and manage students (mock data)
- Navigation between modules
- Dark mode support
- Responsive mobile design

⏳ **Coming Soon**:
- Database integration (Phase 1)
- API endpoints for all modules
- Financial tracking
- Farm operations
- Offline sync
- Notifications

---

## 🔑 Key Features Walkthrough

### 1. Login System
- Navigate to `/login`
- Use demo credentials
- JWT tokens automatically stored in secure httpOnly cookies
- Automatic token refresh on 401

### 2. Dashboard
- Overview of school and farm metrics
- Key performance indicators
- Financial trends chart
- Student distribution chart
- Recent activities and pending actions

### 3. Student Management
- Go to **School → Students**
- View all enrolled students
- Search by name, registration number, or email
- Add new student (uses mock data currently)
- Edit/delete students

### 4. Navigation
- **Sidebar**: Collapsible navigation menu
- **Breadcrumbs**: Current page location (coming soon)
- **Mobile**: Hamburger menu on small screens

---

## 🧪 Testing Your Setup

### Verify Everything Works

1. **Check Node Version**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Should see: `- ready started server on 0.0.0.0:3000`

3. **Open in Browser**
   - Go to `http://localhost:3000`
   - Should redirect to login page

4. **Login with Demo Credentials**
   - Email: `demo@excellence.edu`
   - Password: `Demo@123`
   - Should see dashboard with data

5. **Test Navigation**
   - Click on menu items
   - Visit `/dashboard/school/students`
   - Pages should load without errors

---

## ❌ Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
npm install
```

### Database Connection Error
```
For MVP testing, you don't need database.
The app works with mock data.

When ready to connect:
1. Check DATABASE_URL in .env.local
2. Verify PostgreSQL is running
3. Confirm database exists
```

### CSS Not Loading
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

### "Module not found" Errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## 🎯 Next Steps

1. **Explore the Dashboard**
   - Login and navigate around
   - Check all sections
   - View student management

2. **Set Up Database** (Optional)
   - Use Supabase or Neon
   - Configure DATABASE_URL
   - Run migrations

3. **Customize Settings**
   - Update colors in `app/globals.css`
   - Modify layout components
   - Add your institution logo

4. **Review Code Structure**
   - Check out components in `components/`
   - Review API routes in `app/api/`
   - Look at Prisma schema

5. **Read Documentation**
   - Check [README.md](./README.md) for overview
   - Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed info
   - Review code comments and inline docs

---

## 📚 Learning Resources

### Next.js
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Authentication](https://nextjs.org/docs/app/building-your-application/authentication)

### React
- [React Documentation](https://react.dev)
- [Hooks Guide](https://react.dev/reference/react/hooks)

### Database
- [Prisma ORM](https://www.prisma.io/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Styling
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Other
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React Hook Form](https://react-hook-form.com/get-started)
- [Zod Validation](https://zod.dev/)

---

## 🆘 Need Help?

1. **Check Existing Issues**: Look for similar problems
2. **Read Documentation**: Check README.md and IMPLEMENTATION_GUIDE.md
3. **Review Code Comments**: Most code is well-commented
4. **Inspect Browser Console**: Look for JavaScript errors
5. **Check Terminal Output**: Development server logs are helpful

---

## 🎉 You're Ready!

Your Excellence Entrepreneurship Academy Management System is set up and ready to use.

**Start developing**: `npm run dev`

**Default Login**: 
- Email: `demo@excellence.edu`
- Password: `Demo@123`

---

*Last Updated: Phase 1 MVP Setup Guide*
