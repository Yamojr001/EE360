import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'
);

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

/**
 * Create JWT token
 */
export async function createToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = '30m'
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
  return token;
}

/**
 * Create refresh token
 */
export async function createRefreshToken(
  userId: string,
  tenantId: string,
  expiresIn: string = '7d'
): Promise<string> {
  const token = await new SignJWT({ userId, tenantId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(JWT_REFRESH_SECRET);
  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string; tenantId: string } | null> {
  try {
    const verified = await jwtVerify(token, JWT_REFRESH_SECRET);
    return {
      userId: verified.payload.userId as string,
      tenantId: verified.payload.tenantId as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Set authentication cookies
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();
  
  // Access token - short-lived, httpOnly
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 60, // 30 minutes
    path: '/',
  });

  // Refresh token - longer-lived, httpOnly
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

/**
 * Get current user from cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * Get tokens from cookies
 */
export async function getAuthTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get('accessToken')?.value || null,
    refreshToken: cookieStore.get('refreshToken')?.value || null,
  };
}
