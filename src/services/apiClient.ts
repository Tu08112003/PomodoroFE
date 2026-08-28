export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;
    super(message || body.error || "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export interface ApiUser {
  _id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
}

export interface ApiTodo {
  _id: string;
  clientId?: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiWallpaper {
  _id: string;
  url: string;
  type: "image" | "video" | "custom";
  label: string;
  addedAt: string;
}

export interface ApiYoutubeTrack {
  _id: string;
  url: string;
  videoId: string;
  title: string;
  addedAt: string;
}

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "").endsWith("/api")
  ? configuredBaseUrl.replace(/\/$/, "")
  : `${configuredBaseUrl.replace(/\/$/, "")}/api`;

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;
let onAuthFailure: (() => void) | null = null;

export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailure = handler;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function parseResponseBody(response: Response): Promise<ApiErrorBody> {
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return { message: response.statusText };
  }
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new ApiError(
            response.status,
            await parseResponseBody(response),
          );
        }
        const body = (await response.json()) as { accessToken: string };
        accessToken = body.accessToken;
        return body.accessToken;
      })
      .catch((error) => {
        accessToken = null;
        onAuthFailure?.();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry && !path.startsWith("/auth/refresh")) {
    await refreshAccessToken();
    return request<T>(path, init, false);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseResponseBody(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  register: (payload: {
    email: string;
    password: string;
    displayName?: string;
  }) =>
    request<{ accessToken: string; user: ApiUser }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    ),
  login: (payload: { email: string; password: string }) =>
    request<{ accessToken: string; user: ApiUser }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    ),
  refresh: refreshAccessToken,
  me: () => request<ApiUser>("/users/me"),
  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }, false),
  todos: {
    list: () => request<ApiTodo[]>("/todos"),
    create: (content: string, clientId?: string) =>
      request<ApiTodo>("/todos", {
        method: "POST",
        body: JSON.stringify({ content, clientId }),
      }),
    update: (id: string, payload: { content?: string; completed?: boolean }) =>
      request<ApiTodo>(`/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/todos/${id}`, { method: "DELETE" }),
  },
  wallpapers: {
    list: () => request<ApiWallpaper[]>("/wallpapers"),
    create: (payload: {
      url: string;
      type: "image" | "video" | "custom";
      label?: string;
    }) =>
      request<ApiWallpaper>("/wallpapers", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/wallpapers/${id}`, { method: "DELETE" }),
  },
  youtubeTracks: {
    list: () => request<ApiYoutubeTrack[]>("/youtube-tracks"),
    create: (payload: { url: string; videoId?: string; title: string }) =>
      request<ApiYoutubeTrack>("/youtube-tracks", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<{ message: string }>(`/youtube-tracks/${id}`, {
        method: "DELETE",
      }),
  },
};
