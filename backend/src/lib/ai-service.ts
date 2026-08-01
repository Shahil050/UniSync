const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

if (!AI_SERVICE_URL) {
  throw new Error("AI_SERVICE_URL is not set in the environment.");
}

export class AiServiceError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AiServiceError";
  }
}

async function aiRequest(path: string, init?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(`${AI_SERVICE_URL}${path}`, init);
  } catch (err) {
    throw new AiServiceError("AI service is unreachable.", 503);
  }

  if (!res.ok) {
    throw new AiServiceError(`AI service returned ${res.status}`, res.status);
  }

  return res.json();
}

export const EMBEDDING_MODEL_VERSION = "sentence-transformers/all-MiniLM-L6-v2";

export async function getPaperRecommendations(query: string): Promise<{
  success: boolean;
  query: string;
  recommended_postgres_ids: string[];
}> {
  const qs = new URLSearchParams({ query }).toString();
  return aiRequest(`/getpapers/recommend?${qs}`);
}

export async function registerUserEmbedding(userId: string, interests: string[]) {
  return aiRequest(`/register_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, interest: interests }),
  });
}

export async function submitPaperPdf(postgresId: string, file: File): Promise<{ success: boolean }> {
  const form = new FormData();
  form.append("postgres_id", postgresId);
  form.append("file", file, file.name);
  return aiRequest(`/enter_pdf`, {
    method: "POST",
    body: form,
  });
}

type UserMatch = { user_id: string; similarity_score: number; interests: string };

export async function getSimilarUsers(userId: string): Promise<UserMatch[]> {
  const qs = new URLSearchParams({ user_id: userId }).toString();
  const result = await aiRequest(`/user_recommendation?${qs}`, { method: "POST" });
  return Array.isArray(result) ? result : [];
}