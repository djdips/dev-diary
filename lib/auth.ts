// lib/auth.ts

interface TokenData {
  token: string;
  expiresAt: number;
}

const tokenStore = new Map<string, TokenData>();

const TOKEN_LIFETIME_MS = 1000 * 60 * 15; // 15 minutes

export function generateToken(): string {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_LIFETIME_MS;
  tokenStore.set(token, { token, expiresAt });
  return token;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  const data = tokenStore.get(token);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    tokenStore.delete(token);
    return false;
  }
  return true;
}

export function refreshToken(token: string): string | null {
  const data = tokenStore.get(token);
  if (!data) return null;

  if (Date.now() > data.expiresAt) {
    tokenStore.delete(token);
    return null;
  }

  // Update expiry
  data.expiresAt = Date.now() + TOKEN_LIFETIME_MS;
  tokenStore.set(token, data);
  return token;
}