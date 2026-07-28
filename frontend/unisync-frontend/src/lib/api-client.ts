const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set.");
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
};

async function apiFetch<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, isFormData = false } = opts;

  const headers: HeadersInit = {};
  if (!isFormData && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include", // always send the session cookie cross-origin
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });
  } catch (err) {
    // network failure — backend unreachable, not an HTTP error
    throw new ApiError("Could not reach the server. Check your connection.", 0);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export const api = {
  get: <T = any>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T = any>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  patch: <T = any>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T = any>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  postForm: <T = any>(path: string, formData: FormData) =>
    apiFetch<T>(path, { method: "POST", body: formData, isFormData: true }),
};