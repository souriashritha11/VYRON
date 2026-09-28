import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight


# ============================================
# LOAD ENVIRONMENT VARIABLES
# ============================================

load_dotenv()

API_KEY = os.getenv("HINDSIGHT_API_KEY")
BASE_URL = os.getenv("HINDSIGHT_BASE_URL")
BANK_ID = os.getenv("HINDSIGHT_BANK_ID")


# ============================================
# CONNECT TO HINDSIGHT
# ============================================

client = Hindsight(
    base_url=BASE_URL,
    api_key=API_KEY
)


# ============================================
# CREATE FASTAPI APPLICATION
# ============================================

app = FastAPI(
    title="VYRON API",
    description="Memory-powered AI troubleshooting system",
    version="1.0.0"
)

# ============================================
# LOAD MACHINE DATA
# ============================================

with open("data/machines.json", "r") as file:
    machines = json.load(file)

# ============================================
# ALLOW FRONTEND TO CONNECT
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# REQUEST MODEL
# ============================================

class TroubleshootRequest(BaseModel):
    machine_id: str
    problem: str

class IncidentRequest(BaseModel):
    machine_id: str
    problem: str
    root_cause: str
    action_taken: str
    outcome: str

# ============================================
# HOME / HEALTH CHECK
# ============================================

@app.get("/")
def home():
    return {
        "system": "VYRON",
        "status": "online",
        "message": "VYRON troubleshooting backend is running"
    }


# ============================================
# TROUBLESHOOT ENDPOINT
# ============================================

@app.post("/api/troubleshoot")
def troubleshoot(request: TroubleshootRequest):

    query = f"""
    Machine ID: {request.machine_id}

    Current problem:
    {request.problem}

    Analyze the machine's previous incidents and maintenance
    history. Identify relevant previous problems, likely causes,
    previous repairs, and recommend what the technician should
    check first.
    """

    # Ask Hindsight to retrieve memories
    # and reason over them.
    response = client.reflect(
        bank_id=BANK_ID,
        query=query
    )

    # Collect supporting memories
        # ============================================
    # GET MEMORY EVIDENCE
    # ============================================

    memory_result = client.recall(
        bank_id=BANK_ID,
        query=f"""
        Previous incidents and maintenance history
        for machine {request.machine_id} related to:
        {request.problem}
        """
    )

    memories = []

    if memory_result.results:
        for memory in memory_result.results:
            memories.append({
                "type": memory.type,
                "text": memory.text
            })

    return {
        "success": True,
        "machine_id": request.machine_id,
        "problem": request.problem,
        "recommendation": response.text,
        "memories": memories
    }
# ============================================
# INCIDENT LOGGING / LEARNING ENDPOINT
# ============================================

@app.post("/api/incidents")
def log_incident(request: IncidentRequest):

    incident = f"""
    Machine ID: {request.machine_id}

    Problem:
    {request.problem}

    Root Cause:
    {request.root_cause}

    Action Taken:
    {request.action_taken}

    Outcome:
    {request.outcome}
    """

    # Store the new experience in Hindsight
    client.retain(
        bank_id=BANK_ID,
        content=incident
    )

    return {
        "success": True,
        "message": "Incident stored in VYRON memory.",
        "machine_id": request.machine_id,
        "incident": {
            "problem": request.problem,
            "root_cause": request.root_cause,
            "action_taken": request.action_taken,
            "outcome": request.outcome
        }
    }

# ============================================
# MACHINES ENDPOINT
# ============================================

@app.get("/api/machines")
def get_machines():
    return {
        "success": True,
        "count": len(machines),
        "machines": machines
    }