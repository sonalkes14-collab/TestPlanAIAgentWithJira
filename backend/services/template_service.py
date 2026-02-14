import os

class TemplateService:
    def __init__(self, template_path: str = "backend/templates/master_test_plan.md"):
        # Adjust path relative to where main.py runs
        self.template_path = os.path.abspath(template_path)

    def load_template(self) -> str:
        if not os.path.exists(self.template_path):
            return "# Error: Template not found."
        
        with open(self.template_path, "r", encoding="utf-8") as f:
            return f.read()

    def fill_template(self, template_content: str, data: dict) -> str:
        """
        Simple string replacement for now.
        data keys: JIRA_TICKET_IDS, LLM_MODEL, OVERVIEW_CONTENT, etc.
        """
        filled = template_content
        for key, value in data.items():
            placeholder = "{{" + f" {key} " + "}}" # e.g. {{ PROJECT_NAME }}
            filled = filled.replace(placeholder, str(value))
            # Fallback for no spaces
            placeholder_tight = "{{" + key + "}}"
            filled = filled.replace(placeholder_tight, str(value))
            
        return filled
