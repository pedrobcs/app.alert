import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

// Generate a random nonce for wallet signature verification
export function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(32));
}

// Create the message to sign
export function createSignMessage(nonce: string, walletAddress: string): string {
  return `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'USDC Investment Platform'}!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
}

// Verify a signed message
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Get or create user by wallet address
export async function getOrCreateUser(walletAddress: string) {
  const normalizedAddress = walletAddress.toLowerCase();
  
  let user = await prisma.user.findUnique({
    where: { walletAddress: normalizedAddress },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: normalizedAddress,
        nonce: generateNonce(),
      },
    });
  }
  
  return user;
}

// Update user nonce (should be called after successful login)
export async function updateUserNonce(userId: string): Promise<string> {
  const newNonce = generateNonce();
  await prisma.user.update({
    where: { id: userId },
    data: { nonce: newNonce },
  });
  return newNonce;
}

// Admin authentication with bcrypt
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(username: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });
  
  if (!admin) {
    return null;
  }
  
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return null;
  }
  
  // Update last login
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });
  
  return admin;
}
