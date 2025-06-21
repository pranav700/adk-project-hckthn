import os
from dotenv import load_dotenv

# Optional: loads from .env file during local dev
load_dotenv()

BIGQUERY_TABLE = os.environ.get("BQ_TABLE")
if not BIGQUERY_TABLE:
    raise RuntimeError("BQ_TABLE environment variable is not set")
