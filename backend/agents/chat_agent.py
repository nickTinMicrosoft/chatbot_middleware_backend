import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

# Load environment variables
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
api_base = os.getenv("AZURE_OPENAI_ENDPOINT")

# Create the AzureOpenAI client
client = AzureOpenAI(
    api_key=api_key,
    api_version="2024-02-15-preview",
    azure_endpoint=api_base,
)

def chat_with_gpt(prompt: str) -> str:
    response = client.chat.completions.create(
        model=deployment,  # Azure OpenAI uses `model=deployment_name`
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers users quesions. be friendly"},
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content
