import pandas as pd
import json
import io
from fastapi.responses import StreamingResponse, JSONResponse

class ExportService:
    @staticmethod
    def to_json(data: dict):
        return JSONResponse(content=data, media_type="application/json", headers={"Content-Disposition": "attachment; filename=test_plan.json"})

    @staticmethod
    def to_excel(test_cases: str):
        """
        Parses the markdown table of test cases into a DataFrame and returns an Excel file.
        This is a heuristic parser assuming the specific pipe-table format.
        """
        try:
            # Simple parser for markdown table
            lines = test_cases.strip().split('\n')
            # meaningful lines only
            lines = [l for l in lines if l.strip().startswith('|')]
            
            if len(lines) < 2:
                return None
            
            # Remove header separator (e.g. |---|---|)
            lines = [l for l in lines if '---' not in l]
            
            # Extract headers
            headers = [h.strip() for h in lines[0].strip('|').split('|')]
            
            # Extract rows
            data = []
            for line in lines[1:]:
                row = [cell.strip() for cell in line.strip('|').split('|')]
                if len(row) == len(headers):
                    data.append(row)
            
            df = pd.DataFrame(data, columns=headers)
            
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Test Cases')
            output.seek(0)
            
            return StreamingResponse(
                output, 
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                headers={"Content-Disposition": "attachment; filename=test_plan.xlsx"}
            )
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)
