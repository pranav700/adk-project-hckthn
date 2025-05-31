import os
import sys

# Set root path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from google.adk.agents import SequentialAgent
from agents.doc_agent.agent import doc_parser_agent
from agents.analysis_agent.agent import analysis_agent
from agents.strategy_agent.agent import strategy_loop_agent
from agents.comms_agent.agent import comms_agent


procurement_agent = SequentialAgent(
    name="procurement_agent",
    sub_agents=[doc_parser_agent, analysis_agent, strategy_loop_agent, comms_agent],
    description="Executes a sequence of parsing, analysis, negotiation, and communication.",
)

root_agent = procurement_agent
