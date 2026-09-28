import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

# Load our secret settings from .env
load_dotenv()

api_key = os.getenv("HINDSIGHT_API_KEY")
base_url = os.getenv("HINDSIGHT_BASE_URL")
bank_id = os.getenv("HINDSIGHT_BANK_ID")

if not api_key:
    raise ValueError("HINDSIGHT_API_KEY is missing from .env")

if not bank_id:
    raise ValueError("HINDSIGHT_BANK_ID is missing from .env")

# Connect to Hindsight
client = Hindsight(
    base_url=base_url,
    api_key=api_key
)

print("Connected to Hindsight!")
print(f"Using memory bank: {bank_id}")

# ------------------------------------------------
# RETAIN: Teach VYRON about a previous incident
# ------------------------------------------------

incident = """
Machine M-104 is an industrial cooling unit located in Factory A.
On September 20, 2026, the machine overheated.
The technician discovered that the cooling filter was blocked
and the fan contained heavy dust.
The technician replaced the cooling filter and cleaned the fan.
After the repair, the machine returned to normal operation.
"""

print("\nStoring incident in VYRON memory...")

client.retain(
    bank_id=bank_id,
    content=incident
)

print("Memory stored successfully!")

# ------------------------------------------------
# RECALL: Ask VYRON about the machine's history
# ------------------------------------------------

print("\nSearching VYRON memory...")

result = client.recall(
    bank_id=bank_id,
    query="What happened previously when machine M-104 overheated?"
)

print("\n===== VYRON MEMORY =====")

if not result.results:
    print("No memories found.")
else:
    for memory in result.results:
        print(f"\nType: {memory.type}")
        print(f"Memory: {memory.text}")

print("\n========================")

client.close()