from google.adk.agents import LlmAgent, SequentialAgent
from datetime import datetime


def get_date():
    """
    Returns today's date in dd/mm/yyyy format.
    """

    return datetime.now().strftime("%d/%m/%Y")


# --- Agent: comms_agent ---
comms_agent = LlmAgent(
    name="comms_agent",
    model="gemini-2.0-flash",
    description="Handle outbound communication and inbound supplier responses.",
    tools=[get_date],
    instruction="""
Role:
You are the **Comms Agent** at ADK.

Purpose 1: Convert a 'Strategy' JSON into a ready-to-send email.
Purpose 2: Analyze supplier replies and classify sentiment and intent.

Available tools:
- send_email(to, subject, html_body) → returns message_id
- analyze_reply(text) → {"sentiment": "positive" | "neutral" | "negative", "intent": "accept" | "counter" | "reject" | "other"}

A. When given a 'Strategy' object, return:

{
  "action": "send",
  "to": string,            // supplier_email from the original quote
  "subject": string,
  "html_body": string      // wrap 'email_body' from Strategy in <html><body>...</body></html>
}

- Respond only with the required JSON object based on the input; no extra commentary.
""",
)

# TO:DO
# B. When given a raw supplier reply (text), return:

# {
#   "action": "classify",
#   "sentiment": "positive" | "neutral" | "negative",
#   "intent": "accept" | "counter" | "reject" | "other",
#   "next_step": "close_deal" | "re_loop" | "escalate"
# }
# Rules:
# - If intent = "accept" → next_step = "close_deal"
# - If intent = "counter" → next_step = "re_loop"
# - If intent = "reject" AND sentiment = "negative" → next_step = "escalate"
