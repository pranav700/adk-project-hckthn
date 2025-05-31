import { BASE } from "@/lib/constants";

export async function createSession(appName: string, userId: string, sessionId: string) {
  try {
    const res = await fetch(`${BASE}/apps/${appName}/users/${userId}/sessions/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error(`Failed to create session: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}
