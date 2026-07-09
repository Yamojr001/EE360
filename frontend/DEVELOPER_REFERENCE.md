# Developer Quick Reference

## Quick Commands

```bash
# Development
npm run dev                 # Start dev server (localhost:3000)
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio (GUI)

# Code Quality
npm run lint               # Run ESLint
```

## Project Structure at a Glance

```
app/
  (auth)/login/            # Login page
  (dashboard)/             # Protected area
    dashboard/             # Main dashboard
    school/students/       # Student management
    school/classes/        # (to be built)
    farm/                  # (to be built)
    finance/               # (to be built)
  api/auth/               # Auth endpoints
    login, logout, me, refresh

components/
  dashboard/              # Sidebar, Header
  school/                 # Student form
  ui/                     # shadcn/ui components

lib/
  auth.ts                 # JWT utilities
  api-client.ts          # API with offline support
  utils.ts               # Helpers

prisma/
  schema.prisma          # 50+ tables
```

## File Locations Quick Lookup

| Feature | File |
|---------|------|
| Login Page | `app/(auth)/login/page.tsx` |
| Dashboard | `app/(dashboard)/dashboard/page.tsx` |
| Students Page | `app/(dashboard)/school/students/page.tsx` |
| Student Form | `components/school/student-form.tsx` |
| Sidebar Nav | `components/dashboard/sidebar.tsx` |
| Header | `components/dashboard/header.tsx` |
| Auth Utilities | `lib/auth.ts` |
| API Client | `lib/api-client.ts` |
| Color Theme | `app/globals.css` |
| Database Schema | `prisma/schema.prisma` |

## Key Imports

```typescript
// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Charts
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer } from 'recharts';

// Icons
import { Plus, Edit, Trash2, Search, Menu, LogOut } from 'lucide-react';

// Auth
import { verifyToken, createToken } from '@/lib/auth';

// Utils
import { cn } from '@/lib/utils';
```

## Common Patterns

### Creating a New Page

```typescript
// app/(dashboard)/school/[module]/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ModulePage() {
  const [data, setData] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Module Title</h1>
        <p className="text-muted-foreground">Description</p>
      </div>

      {/* Content */}
    </div>
  );
}
```

### Creating a Form Component

```typescript
// components/school/[module]-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export function ModuleForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
      <Input {...register('name')} placeholder="Name" />
      {errors.name && <p className="text-destructive">{errors.name.message}</p>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Creating an API Endpoint

```typescript
// app/api/[module]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify auth
    const token = request.cookies.get('accessToken')?.value;
    const payload = await verifyToken(token || '');
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = payload.tenantId;
    
    // TODO: Query database
    // const data = await prisma.model.findMany({ where: { tenantId } });

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // TODO: Create in database
    // const created = await prisma.model.create({ data: { ... } });

    return NextResponse.json({ success: true, data: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

## Color Tokens

```typescript
// In Tailwind classes
bg-primary              // Teal (#10b981)
bg-secondary            // Blue (#0ea5e9)
bg-accent               // Emerald (#06b6d4)
text-foreground         // Dark gray / white
bg-background           // White / dark gray
bg-muted                // Light gray / dark gray
bg-destructive          // Red (#ef4444)

// Dark mode
.dark { }  // Automatically inverted colors
```

## Useful Utilities

```typescript
import { cn } from '@/lib/utils';

// Conditional class names
className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-primary text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}
```

## Database Quick Reference

### Common Queries (Future)

```typescript
// In API routes or services
// const student = await prisma.student.findUnique({ where: { id } });
// const students = await prisma.student.findMany({ where: { tenantId } });
// const created = await prisma.student.create({ data: {...} });
// const updated = await prisma.student.update({ where: { id }, data: {...} });
// const deleted = await prisma.student.delete({ where: { id } });
```

### Key Models

```
Student
  - id, tenantId, userId, regNumber, name, dateOfBirth, gender, classId, status

Staff
  - id, tenantId, userId, staffId, department, position, qualifications

Class
  - id, tenantId, name, level, capacity

Subject
  - id, tenantId, name, code, description

Exam
  - id, tenantId, name, startDate, endDate, status

SchoolFee
  - id, tenantId, amount, dueDate, academicYear, term

// Farm Models similar structure with crops, livestock, inventory, workers
```

## Debug Tips

### Check Current User
```typescript
const response = await fetch('/api/auth/me', { credentials: 'include' });
const user = await response.json();
console.log(user);
```

### Check Browser Cookies
```
DevTools → Application → Cookies → localhost:3000
Look for: accessToken, refreshToken
```

### Check Network Requests
```
DevTools → Network → Filter by XHR/Fetch
Look for failed requests and status codes
```

### Check Console Logs
```
DevTools → Console
Look for errors, warnings, and custom logs
```

## Styling Guide

### Spacing
```typescript
// Use Tailwind spacing scale
className="p-4"        // padding
className="m-4"        // margin
className="gap-4"      // gap between items
className="space-y-4"  // vertical spacing between children
```

### Responsive
```typescript
className="md:grid-cols-2 lg:grid-cols-3"  // Mobile → Tablet → Desktop
className="hidden md:block"                 // Hide on mobile
className="text-sm md:text-base lg:text-lg" // Responsive text
```

### Dark Mode
```typescript
// Automatically applied with .dark class
// Use semantic tokens (primary, secondary, foreground, background)
// Don't use direct colors like text-white or bg-black
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Module not found" | Missing import | Check import path, restart dev server |
| Styles not loading | Tailwind cache | `rm -rf .next && npm run dev` |
| JWT not verifying | Wrong secret | Check JWT_SECRET in .env.local |
| 401 Unauthorized | Expired token | Login again, check token refresh |
| Database connection | Missing DATABASE_URL | Check .env.local, verify PostgreSQL running |
| "useContext" error | Called outside provider | Ensure component is within Provider |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+I` | Open DevTools (Windows/Linux) |
| `Cmd+Option+I` | Open DevTools (Mac) |
| `Ctrl+K` | Open Prisma Studio search |
| `Ctrl+Shift+J` | Console tab |
| `Ctrl+Shift+M` | Device toolbar (mobile view) |

## Environment Variables Checklist

```env
□ DATABASE_URL          - PostgreSQL connection (can be empty for MVP)
□ JWT_SECRET            - Random string for JWT signing
□ JWT_REFRESH_SECRET    - Random string for refresh token
□ NEXT_PUBLIC_API_URL   - API base URL (http://localhost:3000)
□ NODE_ENV              - Set to 'development' or 'production'
```

## Testing Checklist

Before committing:
- [ ] Page loads without errors
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Responsive on mobile (F12)
- [ ] Dark mode works (toggle theme)
- [ ] Console has no errors (F12)
- [ ] Login/logout works
- [ ] Protected routes require auth

## Performance Checklist

- [ ] Images are optimized
- [ ] Components are memoized (if needed)
- [ ] API calls are efficient
- [ ] No N+1 queries
- [ ] Lazy loading implemented
- [ ] CSS is minimal
- [ ] No unnecessary re-renders

## Security Checklist

- [ ] Tokens in httpOnly cookies
- [ ] CSRF protection enabled
- [ ] Input validated with Zod
- [ ] No sensitive data in URL
- [ ] No hardcoded secrets
- [ ] CORS configured
- [ ] XSS prevention active

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io)
- [TypeScript](https://www.typescriptlang.org)

## Quick Links

- GitHub: `git push`
- Vercel: Auto-deploy on push
- Prisma Studio: `npm run prisma:studio`
- Database: Configure in .env.local
- API Docs: Check code comments

---

**Keep it bookmarked!** This reference covers 90% of development tasks.
