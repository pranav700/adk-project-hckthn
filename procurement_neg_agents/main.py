import os

import uvicorn
from fastapi import FastAPI
from google.adk.cli.fast_api import get_fast_api_app

from api.generate_request_id import router as generate_request_id_router
from api.save_version import router as save_version_router
from api.get_versions import router as get_versions_router
from api.get_latest_version import router as get_latest_version_router
import logging

# Get the directory where main.py is located
AGENT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "agents"
)  # os.path.dirname(os.path.abspath(__file__)) + "\\agents"
logging.info(f"Agent directory: {AGENT_DIR}")

# Example session DB URL (e.g., SQLite)
# SESSION_DB_URL = "sqlite:///./sessions.db"
# Example allowed origins for CORS
ALLOWED_ORIGINS = ["http://localhost", "http://localhost:8080", "*"]
# Set web=True if you intend to serve a web interface, False otherwise
SERVE_WEB_INTERFACE = True

# Call the function to get the FastAPI app instance
# Ensure the agent directory name ('capital_agent') matches your agent folder
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
# You can add more FastAPI routes or configurations below if needed
# Example:
# @app.get("/hello")
# async def read_root():
#     return {"Hello": "World"}

if __name__ == "__main__":
    # Use the PORT environment variable provided by Cloud Run, defaulting to 8080
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
