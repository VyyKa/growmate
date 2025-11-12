/**
 * Decode JWT token to extract payload
 * Note: This only decodes the token, it does NOT verify the signature.
 * Signature verification is handled by the backend.
 */
export const decodeJWT = (token: string): { sub?: string; [key: string]: any } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    // Base64 URL decode
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Extract user ID from JWT token (from 'sub' claim)
 */
export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.sub) {
    return null;
  }
  const userId = parseInt(decoded.sub, 10);
  return isNaN(userId) ? null : userId;
};

