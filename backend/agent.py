import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

# Load settings from .env
load_dotenv()

api_key = os.getenv("HINDSIGHT_API_KEY")
base_url = os.getenv("HINDSIGHT_BASE_URL")
bank_id = os.getenv("HINDSIGHT_BANK_ID")

# Connect to Hindsight
client = Hindsight(
    base_url=base_url,
    api_key=api_key
)

print("======================================")
print("           VYRON AI AGENT")
print("======================================")

# Current problem reported by technician
problem = """
Machine M-104 is overheating again.
The technician wants to know what should
be checked first based on previous incidents.
"""

print("\nTechnician:")
print(problem)

print("\nVYRON is checking its memory...\n")

# Hindsight retrieves relevant memories
# and reasons over them.
response = client.reflect(
    bank_id=bank_id,
    query=problem
)

print("======================================")
print("              VYRON")
print("======================================")

print(response.text)

print("\n======================================")
print("         MEMORY EVIDENCE")
print("======================================")

if response.based_on:
    for memory in response.based_on:
        print("\nMemory:")
        print(memory.text)

print("\n======================================")