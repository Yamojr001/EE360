import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, createToken } from '@/lib/auth';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token found' },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // TODO: In production, fetch user data from database
    // For MVP, create new access token with demo data
    const newAccessToken = await createToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: 'demo@excellence.edu',
      role: 'admin',
      firstName: 'Demo',
      lastName: 'Admin',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed',
    });

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
