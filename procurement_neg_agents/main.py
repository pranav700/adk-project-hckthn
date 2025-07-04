import json
import os

import uvicorn
from fastapi import FastAPI
from google.adk.cli.fast_api import get_fast_api_app

from api.generate_request_id import router as generate_request_id_router
from api.save_version import router as save_version_router
from api.get_versions import router as get_versions_router
from api.get_latest_version import router as get_latest_version_router
from api.dashboard import router as dashboard_router
from api.update_status import router as update_status_router
from api.file_handler import router as file_handler_router

import logging
from dotenv import load_dotenv

load_dotenv()

# Get the directory where main.py is located
AGENT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "agents"
)  # os.path.dirname(os.path.abspath(__file__)) + "\\agents"
logging.info(f"Agent directory: {AGENT_DIR}")

# Example session DB URL (e.g., SQLite)
# SESSION_DB_URL = "sqlite:///./sessions.db"
# Example allowed origins for CORS
ALLOWED_ORIGINS = json.loads(os.environ["ALLOWED_ORIGINS"])
# Set web=True if you intend to serve a web interface, False otherwise
SERVE_WEB_INTERFACE = False

# Call the function to get the FastAPI app instance

app: FastAPI = get_fast_api_app(
    agents_dir=AGENT_DIR,
    # session_db_url=SESSION_DB_URL,
    allow_origins=ALLOWED_ORIGINS,
    web=SERVE_WEB_INTERFACE,
)

app.include_router(generate_request_id_router)
app.include_router(save_version_router)
app.include_router(get_versions_router)
app.include_router(get_latest_version_router)
app.include_router(dashboard_router)
app.include_router(update_status_router)
app.include_router(file_handler_router)


if __name__ == "__main__":
    # Use the PORT environment variable provided by Cloud Run, defaulting to 8080
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
