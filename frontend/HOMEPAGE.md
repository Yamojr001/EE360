# Excellence Entrepreneurship Academy - Homepage

## Overview

A professional, modern homepage showcasing the Excellence Entrepreneurship Academy Management System. Designed to convert visitors into users through compelling messaging, feature highlights, and clear call-to-action buttons.

## Pages & Routes

### Public Routes (No Authentication Required)
- `/` - Root page (redirects to /home or /dashboard/dashboard based on auth)
- `/home` - Homepage with features, pricing, and CTAs
- `/login` - Login page

### Protected Routes (Authentication Required)
- `/dashboard/*` - All dashboard modules and features

## Components

### Homepage Components

#### FeaturesGrid (`components/home/features-grid.tsx`)
Displays 6 core feature cards in a responsive 3-column grid:
- School Management
- Academic Management
- Financial Management
- Farm Operations
- Analytics & Insights
- Enterprise Ready

Features:
- Hover effects with color transitions
- Icon display with primary color
- Feature list for each module
- Responsive grid layout

#### PricingCards (`components/home/pricing-cards.tsx`)
Displays 3 pricing tiers in a responsive grid:
- Starter (₦49K/month)
- Professional (₦99K/month) - Highlighted as popular
- Enterprise (Custom pricing)

Features:
- Featured plan styling
- Feature lists with icons
- Call-to-action buttons
- Responsive design

### Main Homepage (`app/(public)/home/page.tsx`)

**Structure:**
1. **Navigation Bar**
   - Logo and company name
   - Login and Get Started buttons
   - Sticky positioning with backdrop blur

2. **Hero Section**
   - Large headline with value proposition
   - Subheading describing benefits
   - Two CTA buttons (Start Free Trial, Watch Demo)
   - Gradient background accent

3. **Key Metrics Section**
   - 2000+ Users Supported
   - 50+ Data Modules
   - 99.9% Uptime
   - 24/7 Support
   - 2x2 grid on mobile, 4 columns on desktop

4. **Comprehensive Features**
   - FeaturesGrid component
   - 6 core feature cards
   - Icon and description for each

5. **Capabilities Section**
   - Two-column layout
   - Left: Feature list with check marks
   - Right: Placeholder for visual element
   - Highlights: Intuitive Interface, Scalable, Secure, Offline Ready

6. **Pricing Section**
   - Headline and description
   - PricingCards component
   - 3 pricing tiers

7. **CTA Section**
   - Call-to-action for free trial
   - Secondary action for demo

8. **Footer**
   - 4-column layout: About, Product, Company, Legal
   - Social media links
   - Copyright information

## Design Features

### Color Scheme
- Primary: Teal/Emerald (`--primary: oklch(0.45 0.165 175)`)
- Accent: Complementary teal (`--accent: oklch(0.65 0.18 165)`)
- Neutral: Gray-based backgrounds
- Text: High contrast for accessibility

### Typography
- Headings: Bold, large font sizes (text-5xl to text-2xl)
- Body: Regular weight, readable line-height
- Consistent spacing with Tailwind scale

### Responsive Design
- Mobile-first approach
- Grid adjustments at md and lg breakpoints
- Touch-friendly buttons and spacing
- Collapsible navigation on mobile

### Interactive Elements
- Hover effects on cards (border color, shadow)
- Smooth transitions on all interactive elements
- Button variants (primary, outline)
- Color transitions on hover

## Navigation Flow

```
/ (Root)
├─ Checks localStorage for token
├─ If logged in → /dashboard/dashboard
└─ If not logged in → /home

/home (Public)
├─ Navigation bar
│  └─ Links to /login and /login (Get Started)
├─ Hero section
│  └─ CTA buttons → /login
├─ Features grid
├─ Capabilities section
├─ Pricing section
│  └─ CTA buttons → /login or "Contact Sales"
└─ Footer
   └─ Links to various pages

/login (Public)
├─ Login form
├─ Demo credentials display
└─ Link to /home (back)
```

## Key Features

### Accessibility
- Semantic HTML structure
- High contrast colors (WCAG AA compliant)
- Proper heading hierarchy
- Alt text for images (design-only)
- Screen reader friendly

### Performance
- Minimal JavaScript (mostly static)
- CSS-only animations (no JS overhead)
- Optimized images
- Fast page loads

### SEO
- Proper metadata with title and description
- Semantic HTML
- Proper heading structure
- Mobile-friendly design

### User Experience
- Clear value proposition
- Multiple CTAs throughout
- Feature highlights with benefits
- Pricing transparency
- Professional design
- Trust signals (uptime, users, support)

## Customization Points

### Branding
To customize for different institutions:
1. Update company name/logo in navigation
2. Modify pricing in PricingCards component
3. Update feature descriptions as needed
4. Change color scheme in globals.css

### Content
- Hero section headline and subheading
- Feature descriptions and titles
- Pricing tiers and amounts
- Footer information and links

### Styling
- Color tokens in globals.css
- Tailwind classes throughout
- Button variants
- Spacing and padding

## Integration with Authentication

The homepage integrates seamlessly with the authentication system:
- Demo credentials: `demo@excellence.edu` / `Demo@123`
- Login redirects to dashboard after successful auth
- Root page redirects based on auth status
- Logout clears token and redirects to home

## Related Files

- `app/(public)/layout.tsx` - Public routes layout wrapper
- `app/(auth)/login/page.tsx` - Login page
- `app/(dashboard)/layout.tsx` - Dashboard layout with auth guard
- `lib/auth.ts` - Authentication utilities
- `app/api/auth/*` - Authentication API routes

## Next Steps

Future enhancements:
1. Add testimonials section
2. Add case studies section
3. Add blog integration
4. Add contact form
5. Add customer support chat
6. Add analytics tracking
7. Add newsletter signup
8. Add demo video embedding
