import { BASE } from "@/lib/constants";

export interface Version {
  version_ts: string;
  step_outputs: Record<string, any>;
  quote_status: string;
}

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
  const res = await fetch(`${BASE}/api/save-version`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save version to BigQuery");
  }

  return await res.json();
}

export const updateStatusApi = async (payload: {
  request_id: string;
  quote_status: string;
}) => {

  const response = await fetch(`${BASE}/api/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }
};

export const fetchVersionsByRequestId = async (requestId: string): Promise<Version[]> => {
  const res = await fetch(`${BASE}/api/versions/${requestId}`);
  if (!res.ok) throw new Error("Failed to fetch versions");
  return res.json();
};

