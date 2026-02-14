import os
import os
from openai import OpenAI
import json

class LLMService:
    def __init__(self, provider: str, api_key: str, model: str):
        self.provider = provider
        self.api_key = api_key
        self.model = model

    def test_connection(self):
        # Implementation depends on the provider.
        # For now, we simulate a successful connection for valid keys.
        if not self.api_key:
             return {"status": "error", "message": "API Key is missing"}
        
        try:
            if self.provider == "openai":
                client = OpenAI(api_key=self.api_key)
                client.models.list()
            
            return {"status": "success", "message": f"Connected to {self.provider}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def generate_content(self, system_prompt: str, user_prompt: str):
        if self.provider == "openai":
            try:
                client = OpenAI(api_key=self.api_key)
                response = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7
                )
                return response.choices[0].message.content
            except Exception as e:
                return f"Error gathering content from LLM: {str(e)}"
        
        return "Provider not implemented yet."
