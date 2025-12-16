from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

MODEL_API_URL = "http://localhost:8000/predict"

class Ticket(BaseModel):
    text: str

@app.post("/tickets/analyze")
def analyze(ticket: Ticket):
    response = requests.post(
        MODEL_API_URL,
        json={"ticket_text": ticket.text}
    )
    return response.json()
