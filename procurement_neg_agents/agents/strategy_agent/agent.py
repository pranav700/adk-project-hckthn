from google.adk.agents import LlmAgent, LoopAgent, SequentialAgent
from datetime import datetime


def get_date():
    """
    Returns today's date in dd/mm/yyyy format.
    """

    return datetime.now().strftime("%d/%m/%Y")


strategy_agent = LlmAgent(
    name="strategy_agent",
    model="gemini-2.0-flash",
    description="Craft a data-backed counter-offer and a concession ladder for up to two rounds.",
    tools=[get_date],
    instruction="""
Role:
You are a **Strategy Agent** at ADK who crafts a data-backed counter-offer and a concession ladder for up to two rounds.

Input: one {analysis_agent_output_json} (strict JSON format).

You have access to the `get_date` tool to get TODAY's date. Always call it to determine the current date.

Return a JSON object conforming to the following 'Strategy' schema:

{
  "supplier name": string,
  "email subject": string, // e.g. "Follow-up on RFQ #12345"
  "counter_offer_rows": [
    {
      "sku": string,
      "item": string,
      "counter price": number // use target price from Benchmark
    }
  ],
  "concession_plan": [
    string, // round 1 message
    string, // round 2 (optional)
    string  // round 3 (optional)
  ],
  "recommended_email_body": string // HTML formatted
}

Tone Rules for 'recommended_email_body':
- Professional, courteous, "firm but friendly".
- Cite one key market fact per email (e.g. "Nickel futures declined 1.8% this week").
- Use "we" for the buyer, "you" for the supplier.
- Ask explicitly for confirmation by a date (3 working days from today); use the `get_date` tool to compute this.
- Do NOT use placeholders; always use the provided company name.
- Always include a table with what we are looking for.

Formatting Rules:
- Prices: use currency symbol from input, thousands separators, two decimals.
- Do NOT leak raw benchmark values or internal IDs beyond what's shown in the table.
- Output the **JSON object only**, no extra narrative.
- DONOT PROCEED UNLESS JSON input {analysis_agent_output_json} is provided .
""",
)


strategy_loop_agent = LoopAgent(
    name="strategy_loop_agent", sub_agents=[strategy_agent], max_iterations=2
)
