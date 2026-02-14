from jira import JIRA
import os

class JiraService:
    def __init__(self, instance_url: str, username: str, token: str):
        self.jira = JIRA(server=instance_url, basic_auth=(username, token))

    def test_connection(self):
        try:
            # Try to get the current user details to verify auth
            user = self.jira.myself()
            return {"status": "success", "username": user['displayName']}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def fetch_issues(self, jql: str):
        try:
            issues = self.jira.search_issues(jql, maxResults=50) # Limit to 50 for now
            results = []
            for issue in issues:
                results.append({
                    "key": issue.key,
                    "summary": issue.fields.summary,
                    "description": issue.fields.description if issue.fields.description else "",
                    "status": issue.fields.status.name,
                    "type": issue.fields.issuetype.name
                })
            return {"status": "success", "issues": results}
        except Exception as e:
             return {"status": "error", "message": str(e), "issues": []}
