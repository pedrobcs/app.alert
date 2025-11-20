import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

export interface SessionPayload {
  userId: string;
  walletAddress: string;
  expiresAt: number;
}

export async function createSession(userId: string, walletAddress: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);
  
  const token = await new SignJWT({
    userId,
    walletAddress,
    expiresAt: expiresAt.getTime(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  // Store session in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as SessionPayload;

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    // Delete from database
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  // Clear cookie
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdmin(walletAddress: string): Promise<boolean> {
  const adminAddress = process.env.ADMIN_WALLET_ADDRESS?.toLowerCase();
  return adminAddress === walletAddress.toLowerCase();
}
