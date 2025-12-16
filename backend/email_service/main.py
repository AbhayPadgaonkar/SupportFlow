from fastapi import FastAPI
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os
import base64
import requests

app = FastAPI()
 
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
    
MODEL_API_URL = "http://localhost:8000/predict"
    
def get_gmail_service():
    creds = None

    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json", SCOPES
        )
        creds = flow.run_local_server(port=0)

        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return build("gmail", "v1", credentials=creds)

def get_email_body(message):
    payload = message["payload"]
    parts = payload.get("parts", [])

    for part in parts:
        if part["mimeType"] == "text/plain":
            data = part["body"]["data"]
            return base64.urlsafe_b64decode(data).decode("utf-8")

    return ""

@app.get("/emails/fetch")

def fetch_latest_emails():
    service = get_gmail_service()

    results = service.users().messages().list(
        userId="me",
        maxResults=5
    ).execute()

    messages = results.get("messages", [])
    responses = []

    for msg in messages:
        full_msg = service.users().messages().get(
            userId="me", id=msg["id"]
        ).execute()

        body = get_email_body(full_msg)

        # Send email text to YOUR MODEL API
        model_response = requests.post(
            MODEL_API_URL,
            json={"ticket_text": body}
        ).json()

        responses.append({
            "email_id": msg["id"],
            "email_text": body[:200],
            "model_output": model_response
        })

    return responses
