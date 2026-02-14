# Standard Operating Procedure: Test Plan Generation

## Goal
Generate a comprehensive test plan markdown file based on Jira requirements and a specific API context.

## Inputs
1.  **Jira Configuration**: URL, Auth Token, Project/Issue Keys.
2.  **API Context**: Base URL, Swagger/OpenAPI Spec (optional), Auth Headers.
3.  **LLM Configuration**: Provider, Model, API Key.
4.  **Template**: Markdown template with placeholders (e.g., `{{ TEST_CASES }}`).

## Logic Flow
1.  **Validate Inputs**: Ensure all configurations are valid and services are reachable.
2.  **Fetch Requirements**:
    -   Connect to Jira.
    -   Query issues using JQL (e.g., `project = KEY AND issuetype = Story`).
    -   Extract Summary, Description, and Acceptance Criteria.
3.  **Prepare Context**:
    -   Combine Requirement Text.
    -   Load Master Test Plan Template.
    -   Inject API Context.
4.  **Generate Content (LLM)**:
    -   **Prompt 1 (Strategy)**: specific prompt to generate Test Strategy based on requirements.
    -   **Prompt 2 (Test Cases)**: specific prompt to generate detailed test cases (Positive, Negative, Security).
5.  **Assembly**:
    -   Replace placeholders in the Template with generated content.
6.  **Output**:
    -   Return the final Markdown string.

## Error Handling
-   **Jira Auth Fail**: Return 401. Prompt user to check token.
-   **LLM Rate Limit**: Return 429. Implement exponential backoff (optional) or notify user.
-   **Empty Requirements**: Warn user if no issues found.
