import { APP_NAME, BASE, PROCUREMENT_AGENTS } from '@/lib/constants';

type StepCallback = (stepKey: string, description: string, stepIndex: number) => void;

export async function startProcurement(
  prompt: string,
  appName: string = APP_NAME,
  userId: string,
  sessionId: string,
  inlineData: Record<string, any>,
  onStep: StepCallback
) {
  const res = await fetch(`${BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appName,
      userId,
      sessionId,
      newMessage: {
        role: 'user',
        parts: [{ text: prompt }, { inlineData }],
      },
      streaming: false,
    }),
  });

  if (!res.ok) {
    console.error(`Failed to call /run: ${res.statusText}`);
    return;
  }

  const json = await res.json();

  for (const item of json) {
    try {
      const description = item.content.parts?.[0]?.text || '';
      const author = item.author;

      const stepIndex = PROCUREMENT_AGENTS.indexOf(author);
      if (stepIndex !== -1) {
        onStep(author, description, stepIndex);
      }
    } catch (e) {
      console.error('Malformed /run response item:', e, item);
    }
  }
}
