import { BASE } from "@/lib/constants";

export async function generateRequestId(): Promise<string> {
  const res = await fetch(`${BASE}/api/generate-request-id`, { method: "POST" });
  const data = await res.json();
  return data.id;
}

export async function saveVersionToBQ(payload: {
  requestId: string;
  userId: string;
  sessionId: string;
  appName: string;
  timestamp: string;
  stepOutputs: any;
  quote_status: string;
}) {
  const res = await fetch(`${BASE}/api/save-version-bq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save version to BigQuery");
  }

  return await res.json();
}
