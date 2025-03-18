from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import sys
import os
import logging

logger = logging.getLogger(__name__)

# Add the root project directory to the sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from ML.predictor.prediction import predict_next_foods


@require_http_methods(["POST"])
def predict_food(request):
    try:
        data = json.loads(request.body)
        food_name = data.get('food_name')
        
        if not food_name:
            return JsonResponse({
                'error': 'food_name is required'
            }, status=400)
            
        predictions = predict_next_foods(food_name)
        
        return JsonResponse({
            'food_name': food_name,
            'predictions': predictions
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    
    except Exception as e:
        logger.error(f"Prediction Error: {str(e)}", exc_info=True)  # Log full traceback
        return JsonResponse({'error': 'Internal Server Error'}, status=500)
    

def health_check(request):
    return JsonResponse({"status": "Server is running"}, status=200)