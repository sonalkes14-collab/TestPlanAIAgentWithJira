# Project GEMINI (Single Source of Truth)

## 1. Discovery
Please answer the following questions to proceed with Phase 1:

1. **North Star:** What is the singular desired outcome?
   Answer: Create a comprehensive web application that automatically generates test plans for APIs by integrating with Jira and LLM services.

2. **Integrations:** Which external services (Slack, Shopify, etc.) do we need? Are keys ready?
   Answer:
   - **Target API:** User-provided (Base URL + Auth).
   - **Jira:** Fetch requirements/user stories (Instance URL + Auth).
   - **LLMs:** Cloud (OpenAI, Claude, Gemini) and Local (Ollama, LM Studio).

3. **Source of Truth:** Where does the primary data live?
   Answer:
   - **Requirements:** Jira.
   - **Test Logic/Standard:** Template file (provided).
   - **Configuration:** User input during session.

4. **Delivery Payload:** How and where should the final result be delivered?
   Answer:
   - **UI:** Displayed in a formatted view with inline editing.
   - **Export:** PDF, Markdown, Excel, or JSON.
   - **Storage:** Option to save/push back to Jira (optional).

5. **Behavioral Rules:** How should the system "act"? (e.g., Tone, specific logic constraints, or "Do Not" rules).
   Answer:
   - **Security:** "Secure credential handling (never log API keys)". Encrypt in transit/rest.
   - **UX:** Modern, responsive, real-time validation, dark/light mode.
   - **Reliability:** Error handling and retry logic for API/LLM calls.

## 2. JSON Data Schema

### Project Configuration
```json
{
  "api_config": {
    "base_url": "string",
    "auth_header": "string"
  },
  "jira_config": {
    "instance_url": "string",
    "project_key": "string",
    "auth_token": "string"
  },
  "llm_config": {
    "provider": "openai|anthropic|gemini|ollama|lm_studio",
    "model": "string",
    "api_key": "string",
    "base_url": "string (optional for local)"
  }
}
```

### Test Plan Artifact
```json
{
  "metadata": {
    "generated_at": "datetime",
    "source_requirements": ["jira_ticket_id..."],
    "llm_model": "string"
  },
  "test_plan": {
    "overview": "string",
    "scope": "string",
    "test_strategy": "string",
    "test_cases": [
      {
        "id": "TC-001",
        "title": "string",
        "description": "string",
        "type": "functional|security|performance|integration",
        "priority": "P0|P1|P2",
        "mapped_requirement": "JIRA-ID",
        "preconditions": ["string"],
        "steps": ["string"],
        "expected_result": "string",
        "test_data": "string"
      }
    ]
  }
}
```

## 3. Architecture (To be updated as we build)

## 4. Maintenance Log (To be finalized in Phase 5)
