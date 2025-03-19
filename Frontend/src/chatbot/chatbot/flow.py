from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from mira_sdk import MiraClient, Flow
import os
from dotenv import load_dotenv

#http://127.0.0.1:8000/chatbot/
#post request with the parameters in the body

load_dotenv()

# Initialize MiraClient
api_key = os.getenv("MIRA_API_KEY")
client = MiraClient(config={"API_KEY": api_key})

# Get the absolute path to flow.yaml
current_dir = os.path.dirname(os.path.abspath(__file__))
flow_yaml_path = os.path.join(current_dir, "flow.yaml")
flow = Flow(source=flow_yaml_path)


def mira_flow_endpoint(request):
    """Handles both GET and POST requests for the Mira Flow API."""
    if request.method in ["POST", "GET"]:
        try:
            if request.method == "POST":
                data = json.loads(request.body)
            else:  # GET request: Fetch parameters from the query string
                data = request.GET.dict()  # Converts QueryDict to a normal dictionary

            # Extract parameters from request
            input_dict = {
                "lang": data.get("lang", "English"),
                "detail": data.get("detail", "")
            }
            
            # Call Mira SDK
            response = client.flow.test(flow, input_dict)
            
            return JsonResponse({"response": response})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


def health_check(request):
    return JsonResponse({"status": "Server is running"}, status=200)