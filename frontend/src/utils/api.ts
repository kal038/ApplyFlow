const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
};
