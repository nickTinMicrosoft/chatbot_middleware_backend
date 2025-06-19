# Bot Middleware

This project is a middleware service designed to integrate with [Azure Bot Service](https://azure.microsoft.com/en-us/products/bot-services/). It acts as a bridge between Azure Bot Service and a backend powered by a Large Language Model (LLM).

## Overview

- **Receives messages** from Azure Bot Service.
- **Forwards prompts** to a backend service (LLM).
- **Receives responses** from the backend.
- **Returns messages** to Azure Bot Service.

## Architecture

```mermaid
flowchart LR
    A[Azure Bot Service] -->|Message| B[Middleware]
    B -->|Prompt| C[Backend (LLM)]
    C -->|Response| B
    B -->|Reply| A
```

## Repo
 This repo contains the following
  - Middleware
    - A Node based api currently set to run on local host on port 3978
    - Tested using Azure Bot Service Emulator
        - Chatbot set to http://localhost:3978/api/messages
- Backend
    - An uvicorn api that has two agents
        - Chat agent
            - Agent that performs simple chat with GPT-4o in an Azure Open AI enpoint
        - Rag agent 
            - An agent that reads data from an Azure AI Search index and performs RAG with Azure Open AI endpoint GPT-4o. 


## Features

- Seamless integration with Azure Bot Service.
- Decoupled backend for LLM processing.
- Simple, extensible middleware logic.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/bot_middle_back.git
   cd bot_middle_back
   ```

2. **Configure environment variables:**  
   Update configuration files as needed for Azure and backend endpoints.

3. **Run the middleware:**  
   ```bash
   # Example command
   python app.py
   ```

## Azure Best Practices

- Use secure authentication between services.
- Handle errors and retries gracefully.
- Log and monitor all message flows.
- Protect sensitive data in transit and at rest.

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.