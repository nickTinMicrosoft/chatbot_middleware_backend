from utils.azure_search import query_index
from agents.chat_agent import chat_with_gpt

def chat_with_rag(prompt: str) -> str:
    docs = query_index(prompt)
    context = "\n".join(docs)
    final_prompt = f"Answer based on the following:\n\n{context}\n\nQuestion: {prompt}"
    return chat_with_gpt(final_prompt)
