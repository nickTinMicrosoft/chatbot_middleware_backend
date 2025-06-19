from fastapi import FastAPI, Request
from pydantic import BaseModel
from agents.chat_agent import chat_with_gpt
from agents.rag_agent import chat_with_rag

app = FastAPI()

class ChatRequest(BaseModel):
    prompt: str
    agent: str  # "chat" or "rag"

@app.post("/chat")
async def chat(req: ChatRequest):
    if req.agent == "chat":
        response = chat_with_gpt(req.prompt)
    elif req.agent == "rag":
        response = chat_with_rag(req.prompt)
    else:
        return {"error": "Invalid agent"}
    return {"response": response}
