import type {
  AuthSession,
  AuthUser,
  ApplicabilityCheckRequest,
  ApplicabilityCheckResponse,
  LawApiRecord,
  LoginRequest,
  LoginResponse,
  RiskLevel,
  SignUpRequest,
  SignUpResponse,
} from "@/types";

const DEFAULT_TIMEOUT_MS = 12000;

type ApiErrorCode = "TIMEOUT" | "NETWORK" | "HTTP" | "PARSE" | "INVALID_RESPONSE";

type ApiRequestOptions = RequestInit & {
  timeoutMs?: number;
};

export class ApiError extends Error {
  status?: number;
  code: ApiErrorCode;
  retryable: boolean;

  constructor(message: string, options: { status?: number; code: ApiErrorCode; retryable?: boolean }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.retryable = options.retryable ?? true;
  }
}

function getBaseUrl(): string {
  const configuredUrl = (process.env.NEXT_PUBLIC_API_URL ?? "/api").replace(/\/$/, "");

  if (typeof window === "undefined") {
    return configuredUrl;
  }

  if (!configuredUrl.startsWith("http://") && !configuredUrl.startsWith("https://")) {
    return configuredUrl;
  }

  try {
    const target = new URL(configuredUrl);
    if (target.origin !== window.location.origin) {
      return "/api";
    }
  } catch {
    return "/api";
  }

  return configuredUrl;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function sanitizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeRiskLevel(value: unknown): RiskLevel {
  return value === "HIGH" || value === "MEDIUM" || value === "LOW" ? value : "MEDIUM";
}

function getMessageFromPayload(payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  const record = asRecord(payload);
  if (!record) {
    return "";
  }

  const candidate = record.detail ?? record.message ?? record.error;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : "";
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) {
    return null;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const looksJson =
    contentType.includes("application/json") ||
    contentType.includes("+json") ||
    text.trim().startsWith("{") ||
    text.trim().startsWith("[");

  if (!looksJson) {
    if (res.ok) {
      throw new ApiError("The server returned an unreadable response.", {
        status: res.status,
        code: "PARSE",
        retryable: false,
      });
    }

    return text.trim();
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError("The server returned an unreadable response.", {
      status: res.status,
      code: "PARSE",
      retryable: false,
    });
  }
}

function normalizeApplicableLaw(value: unknown, index: number) {
  const record = asRecord(value);
  if (!record) {
    return {
      id: `law-${index}`,
      law: `Regulation ${index + 1}`,
      jurisdiction: "Not provided",
      risk: "MEDIUM" as const,
      reason: "No risk rationale provided.",
      next_step: "No action specified",
    };
  }

  return {
    id: typeof record.id === "string" && record.id.trim() ? record.id.trim() : `law-${index}`,
    law: sanitizeText(record.law, sanitizeText(record.name, sanitizeText(record.title, `Regulation ${index + 1}`))),
    jurisdiction: sanitizeText(record.jurisdiction, "Not provided"),
    risk: normalizeRiskLevel(record.risk),
    reason: sanitizeText(record.reason, sanitizeText(record.summary, "No risk rationale provided.")),
    next_step: sanitizeText(record.next_step, "No action specified"),
  };
}

function normalizeApplicabilityResponse(payload: unknown): ApplicabilityCheckResponse {
  const record = asRecord(payload);
  if (!record) {
    throw new ApiError("The assessment response was incomplete.", {
      code: "INVALID_RESPONSE",
      retryable: true,
    });
  }

  const riskScore =
    typeof record.risk_score === "number" && Number.isFinite(record.risk_score)
      ? Math.max(0, Math.min(100, record.risk_score))
      : 0;

  const applicableLaws = Array.isArray(record.applicable_laws)
    ? record.applicable_laws.map((item, index) => normalizeApplicableLaw(item, index))
    : [];
  const sourceLaws = Array.isArray(record.source_laws)
    ? record.source_laws
        .map((item, index) => normalizeLawApiRecord(item, index))
        .filter((item): item is LawApiRecord => Boolean(item))
        .map((item, index) => ({
          id: item.id ?? `source-law-${index}`,
          source: item.source ?? "congress_gov",
          law: item.law ?? item.title ?? item.name ?? "Federal record",
          jurisdiction: item.jurisdiction ?? "United States",
          level: item.level ?? "federal",
          status: item.status ?? "IN_PROGRESS",
          risk: item.risk ?? "MEDIUM",
          reason: item.summary ?? "Summary unavailable.",
          latest_action: item.latest_action ?? null,
          source_url: item.source_url ?? null,
          url: item.source_url ?? null,
          latest_action_date: item.latest_action_date ?? null,
          last_synced_at: null,
        }))
    : undefined;

  return {
    risk_score: riskScore,
    applicable_laws: applicableLaws,
    source_laws: sourceLaws,
  };
}

function normalizeLawApiRecord(value: unknown, index: number): LawApiRecord | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const normalizeStringArray = (candidate: unknown) =>
    Array.isArray(candidate)
      ? candidate
          .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
          .map((item) => item.trim())
      : [];

  return {
    id: sanitizeText(record.id, `law-${index}`),
    name: sanitizeText(record.name, sanitizeText(record.law, sanitizeText(record.title, `Regulation ${index + 1}`))),
    law: sanitizeText(record.law, sanitizeText(record.name, sanitizeText(record.title, `Regulation ${index + 1}`))),
    title: sanitizeText(record.title, sanitizeText(record.name, sanitizeText(record.law, `Regulation ${index + 1}`))),
    jurisdiction: sanitizeText(record.jurisdiction, "Not provided"),
    level: sanitizeText(record.level, "federal"),
    status: sanitizeText(record.status, "IN_PROGRESS"),
    summary: sanitizeText(record.summary, "Summary unavailable."),
    risk: normalizeRiskLevel(record.risk),
    category: sanitizeText(record.category, "AI Governance"),
    source: sanitizeText(record.source, "congress_gov"),
    source_label: sanitizeText(record.source_label, "Congress.gov"),
    source_url: sanitizeText(record.source_url, ""),
    latest_action: sanitizeText(record.latest_action, "Latest action unavailable."),
    latest_action_date:
      typeof record.latest_action_date === "string" && record.latest_action_date.trim()
        ? record.latest_action_date.trim()
        : null,
    effective_date:
      typeof record.effective_date === "string" && record.effective_date.trim()
        ? record.effective_date.trim()
        : null,
    bill_number: sanitizeText(record.bill_number, ""),
    bill_type: sanitizeText(record.bill_type, ""),
    congress: typeof record.congress === "number" ? record.congress : undefined,
    tags: normalizeStringArray(record.tags),
    use_cases: normalizeStringArray(record.use_cases),
    affected_workflows: normalizeStringArray(record.affected_workflows),
    enforcement_stage: sanitizeText(record.enforcement_stage, "Active Legislative Process"),
    enforcement_status: sanitizeText(record.enforcement_status, "Pending congressional action"),
  };
}

function normalizeLawsResponse(payload: unknown): LawApiRecord[] {
  const payloadRecord = asRecord(payload);
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payloadRecord?.laws)
      ? payloadRecord.laws
      : [];

  const seen = new Set<string>();

  return list
    .map((item, index) => normalizeLawApiRecord(item, index))
    .filter((item): item is LawApiRecord => Boolean(item))
    .filter((item) => {
      const key = item.id ?? item.title ?? item.name ?? "";
      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function normalizeAuthUser(value: unknown): AuthUser | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  return {
    id: typeof record.id === "string" ? record.id : null,
    email: typeof record.email === "string" ? record.email : null,
    role: typeof record.role === "string" ? record.role : null,
    created_at: typeof record.created_at === "string" ? record.created_at : null,
    last_sign_in_at:
      typeof record.last_sign_in_at === "string" ? record.last_sign_in_at : null,
    email_confirmed_at:
      typeof record.email_confirmed_at === "string" ? record.email_confirmed_at : null,
  };
}

function normalizeAuthSession(value: unknown): AuthSession | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  return {
    access_token: typeof record.access_token === "string" ? record.access_token : null,
    refresh_token: typeof record.refresh_token === "string" ? record.refresh_token : null,
    expires_in: typeof record.expires_in === "number" ? record.expires_in : null,
    expires_at: typeof record.expires_at === "number" ? record.expires_at : null,
    token_type: typeof record.token_type === "string" ? record.token_type : null,
  };
}

function normalizeLoginResponse(payload: unknown): LoginResponse {
  const record = asRecord(payload);
  if (!record) {
    throw new ApiError("The login response was incomplete.", {
      code: "INVALID_RESPONSE",
      retryable: true,
    });
  }

  const normalized = {
    success: typeof record.success === "boolean" ? record.success : true,
    message: sanitizeText(record.message, "Login successful."),
    user: normalizeAuthUser(record.user),
    session: normalizeAuthSession(record.session),
  };

  if (
    normalized.success &&
    (!normalized.user || !normalized.session || !normalized.session.access_token)
  ) {
    throw new ApiError("The authentication response was incomplete.", {
      code: "INVALID_RESPONSE",
      retryable: true,
    });
  }

  return normalized;
}

function normalizeSignupResponse(payload: unknown): SignUpResponse {
  const record = asRecord(payload);
  if (!record) {
    throw new ApiError("The signup response was incomplete.", {
      code: "INVALID_RESPONSE",
      retryable: true,
    });
  }

  return {
    success: typeof record.success === "boolean" ? record.success : true,
    message: sanitizeText(
      record.message,
      "Account created. Confirm your email address before signing in."
    ),
    user: normalizeAuthUser(record.user),
    session: normalizeAuthSession(record.session),
    confirmation_required:
      typeof record.confirmation_required === "boolean"
        ? record.confirmation_required
        : true,
  };
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError("The request timed out.", { code: "TIMEOUT" });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || "Network request failed.", { code: "NETWORK" });
  }

  return new ApiError("Network request failed.", { code: "NETWORK" });
}

async function request(path: string, init?: ApiRequestOptions): Promise<unknown> {
  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const payload = await parseResponseBody(res);

    if (!res.ok) {
      throw new ApiError(
        getMessageFromPayload(payload) || `Request failed with status ${res.status}.`,
        {
          status: res.status,
          code: "HTTP",
          retryable: res.status >= 500 || res.status === 408 || res.status === 429,
        }
      );
    }

    return payload;
  } catch (error) {
    throw toApiError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = toApiError(error);
  const isProduction = process.env.NODE_ENV === "production";
  const safeFallback = fallback.trim() || "The service is unavailable right now. Please try again.";

  if (apiError.code === "TIMEOUT") {
    return "The request timed out. Please try again.";
  }

  if (apiError.code === "PARSE" || apiError.code === "INVALID_RESPONSE") {
    return apiError.message || safeFallback;
  }

  if (apiError.code === "NETWORK") {
    return isProduction ? safeFallback : apiError.message || safeFallback;
  }

  if (apiError.code === "HTTP" && apiError.status && apiError.status >= 500) {
    return isProduction ? safeFallback : apiError.message || safeFallback;
  }

  return apiError.message || safeFallback;
}

export async function checkApplicability(
  body: ApplicabilityCheckRequest
): Promise<ApplicabilityCheckResponse> {
  const response = await request("/applicability/check", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return normalizeApplicabilityResponse(response);
}

export async function getLaws(): Promise<LawApiRecord[]> {
  const response = await request("/laws");
  return normalizeLawsResponse(response);
}

export async function getLawById(lawId: string): Promise<LawApiRecord | null> {
  const laws = await getLaws();
  return laws.find((law) => law.id === lawId) ?? null;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return normalizeLoginResponse(response);
}

export async function signup(body: SignUpRequest): Promise<SignUpResponse> {
  const response = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return normalizeSignupResponse(response);
}
