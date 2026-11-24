// Appels au serveur de traitement : jeton de session ajouté automatiquement,
// erreurs converties en messages français (jamais de code technique à l'écran).

import { createBrowserSupabase } from './supabase-browser';
import { getBackendUrl } from './backend-url';
import { translateError } from './error-translator';

export class ApiError extends Error {
  code: string;
  status: number;
  data: Record<string, any>;

  constructor(code: string, status: number, data: Record<string, any> = {}) {
    super(translateError(code));
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

async function accessToken(): Promise<string> {
  const supabase = createBrowserSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new ApiError('unauthorized', 401);
  return session.access_token;
}

export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (init.body && !isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let response: Response;
  try {
    response = await fetch(`${getBackendUrl()}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('network', 0);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(typeof data?.error === 'string' ? data.error : 'server_error', response.status, data);
  }
  return response;
}

export async function backendJson<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await backendFetch(path, init);
  return response.json() as Promise<T>;
}

export interface Usage {
  plan: string;
  paid: boolean;
  limit: number;
  used: number;
  remaining: number;
  subscription: null | {
    status: string;
    plan: string | null;
    period_end: string | null;
    cancel_at_period_end: boolean;
  };
}

export const fetchUsage = () => backendJson<Usage>('/api/usage');
