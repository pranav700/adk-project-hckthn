import os
import sys
import json

from google.adk.agents import LlmAgent


# --- Tool: get_last_price ---
def get_last_price(sku: str, supplier: str | None = None):
    """
    Returns {"price": float, "date": "YYYY-MM-DD"} or None.
    Looks in Postgres first, then DuckDB as fallback.
    """

    supplier_clause = f"AND supplier = '{supplier}'" if supplier else ""
    query = f"""
    SELECT unit_price, quote_date
    FROM deals
    WHERE sku = '{sku}'
    {supplier_clause}
    ORDER BY quote_date DESC
    LIMIT 1
    """
    # Run the query against the DBs...
    # (Simulated)
    return None  # Replace with actual query logic


# --- Tool: get_market_price ---
def get_market_price(sku: str):
    """
    Maps SKU to a commodity code via a free source and returns market data.
    Returns: {"price": float, "source": str, "date": "YYYY-MM-DD"} or None.
    """
    mapping = json.load(open("sku_to_commodity.json"))
    commodity = mapping.get(sku)
    if not commodity:
        return None

    # Lookup logic would go here...
    # e.g. query FRED or Alpha Vantage
    return None  # Replace with actual lookup logic


analysis_agent = LlmAgent(
    name="analysis_agent",
    model="gemini-2.0-flash",
    description="Benchmark supplier quotes using historical and market pricing.",
    output_key="analysis_agent_output_json",
    instruction="""
      Role:
      You are a Benchmarking Agent.

      Input: a {doc_agent_parsed_json} JSON object.

      Available tools:
      * get_last_price(sku, supplier) -> {"price": float, "date": "YYYY-MM-DD"}
      * get_market_price(sku) -> {"price": float, "source": string, "date": "YYYY-MM-DD"}

      Task:
      1. Enrich each line-item with:
        - Last price (if available)
        - Market price (if available)
        - Target price: the lower of (quote_price - 5%) and (market_price - 2%), unless result < 0.

      2. Add an analysis note (max 80 chars, e.g. "Nickel +12% YoY").

      3. Return output matching **exactly** this JSON schema:

      {
        "supplier name": string,
        "summary": string, // max 280 chars plain English; state overall delta
        "sku rows": [
          {
            "item": string,
            "sku": string,
            "quote_price": number,
            "last_price": number | null,
            "market_price": number | null,
            "target_price": number,
            "analysis_note": string
          }
        ]
      }

      Rules:
      - Always call 'get_last_price' **first**.
      - Proceed even if it returns null.
      - Do NOT reveal tool calls.
      - Do NOT include any comments in JSON.
      - Respond in valid, strict JSON format only.
      """,
)

root_agent = analysis_agent
