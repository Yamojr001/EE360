import { NextRequest, NextResponse } from 'next/server';
import { createToken, createRefreshToken, setAuthCookies } from '@/lib/auth';

/**
 * POST /api/auth/login
 * User login endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: In production, query database
    // For MVP, use demo credentials
    if ((email === 'demo@excellence.edu' || email === 'demo@ee360.edu') && password === 'Demo@123') {
      // Create tokens
      const accessToken = await createToken({
        userId: 'demo-user-1',
        tenantId: 'demo-tenant-1',
        email: 'demo@excellence.edu',
        role: 'admin',
        firstName: 'Demo',
        lastName: 'Admin',
      });

      const refreshToken = await createRefreshToken('demo-user-1', 'demo-tenant-1');

      // Create response
      const response = NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            userId: 'demo-user-1',
            email: 'demo@excellence.edu',
            firstName: 'Demo',
            lastName: 'Admin',
            role: 'admin',
          },
        },
        { status: 200 }
      );

      // Set cookies
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60, // 30 minutes
        path: '/',
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
