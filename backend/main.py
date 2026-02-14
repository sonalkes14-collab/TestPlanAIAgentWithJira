from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.jira_service import JiraService
from services.llm_service import LLMService
from services.export_service import ExportService
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Test Plan Generator API", version="1.0.0")

# CORS Setup
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:5174", # Vite fallback
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class JiraConfig(BaseModel):
    instance_url: str
    username: str
    api_token: str

class LLMConfig(BaseModel):
    provider: str
    model: str
    api_key: str

class TestConnectionResponse(BaseModel):
    status: str
    message: str
    username: str = None

class GenerateRequest(BaseModel):
    jira_config: JiraConfig
    llm_config: LLMConfig
    api_context: str # Base URL, etc.
    requirements: list # List of requirement objects (key, summary, description)

class ExportRequest(BaseModel):
    full_plan: dict

# --- Routes ---

@app.get("/")
async def root():
    return {"message": "Test Plan Generator API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/jira/connect", response_model=TestConnectionResponse)
async def connect_jira(config: JiraConfig):
    try:
        service = JiraService(config.instance_url, config.username, config.api_token)
        result = service.test_connection()
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/llm/verify", response_model=TestConnectionResponse)
async def verify_llm(config: LLMConfig):
    try:
        service = LLMService(config.provider, config.api_key, config.model)
        result = service.test_connection()
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/jira/fetch_requirements")
async def fetch_requirements(config: JiraConfig, jql: str):
    try:
        service = JiraService(config.instance_url, config.username, config.api_token)
        result = service.fetch_issues(jql)
        if result["status"] == "error":
             raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
async def generate_test_plan(request: GenerateRequest):
    try:
        # 1. Prepare Context
        requirements_text = "\n".join([f"Ticket: {r['key']} - {r['summary']}\nDescription: {r['description']}" for r in request.requirements])
        
        # 2. Initialize LLM
        llm = LLMService(request.llm_config.provider, request.llm_config.api_key, request.llm_config.model)
        
        # 3. Generate Strategy (Layer 1)
        system_prompt = "You are an expert QA Automation Engineer. Generate a comprehensive Test Strategy based on the provided requirements."
        strategy = llm.generate_content(system_prompt, f"Requirements:\n{requirements_text}\n\nAPI Context: {request.api_context}")
        
        # 4. Generate Test Cases (Layer 2)
        system_prompt_tc = "You are an expert QA Automation Engineer. Generate detailed Test Cases in a markdown table format like this: | ID | Title | Priority | Type | Requirement | Steps | Expected Result | Test Data |"
        test_cases = llm.generate_content(system_prompt_tc, f"Requirements:\n{requirements_text}\n\nKey Strategy Points: {strategy}")
        
        # 5. Assemble Plan (Layer 3)
        return {
            "strategy": strategy,
            "test_cases": test_cases,
            "full_plan": f"# Test Plan\n\n## Strategy\n{strategy}\n\n## Test Cases\n{test_cases}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export/json")
async def export_json(request: ExportRequest):
    return ExportService.to_json(request.full_plan)

@app.post("/api/export/excel")
async def export_excel(request: ExportRequest):
    if 'test_cases' not in request.full_plan:
         raise HTTPException(status_code=400, detail="Missing 'test_cases' data for Excel export")
    # full_plan is a dict coming from the frontend, likely matching the generate response structure
    return ExportService.to_excel(request.full_plan['test_cases'])
