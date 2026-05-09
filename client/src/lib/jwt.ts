export interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

const decodeSegment = (segment: string) => {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

export const decodeJwt = (token: string): JwtPayload | null => {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeSegment(parts[1]));
  } catch {
    return null;
  }
};
