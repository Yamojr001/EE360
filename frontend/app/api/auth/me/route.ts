import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        tenantId: payload.tenantId,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
