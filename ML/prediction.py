import joblib
from rapidfuzz import process  # Fuzzy matching
import random
import os

# Get the directory where prediction.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load trained Markov Chain model & food list
transitions = joblib.load(os.path.join(current_dir, "markov_food_model.pkl"))
food_list = joblib.load(os.path.join(current_dir, "food_list.pkl"))

def correct_food_name(food, choices):
    """Corrects food name using fuzzy matching (case-insensitive)."""
    best_match, score, _ = process.extractOne(food.lower(), choices)  # Convert to lowercase
    return best_match if score > 80 else food.lower()  # Apply correction only if confidence > 80%

def predict_next_foods(current_food, top_n=2):
    """
    Predicts the most likely next foods based on the given food using Markov Chain.
    Uses fuzzy matching to handle typos. Case insensitive.
    """
    # Convert input to lowercase
    corrected_food = correct_food_name(current_food, food_list)

    if corrected_food not in transitions:
        return ["No prediction available"]

    # Sort foods by transition probability
    next_foods = sorted(transitions[corrected_food].items(), key=lambda x: x[1], reverse=True)
    return [food for food, prob in next_foods[:top_n]]

# Example usage
if __name__ == "__main__":
    current_food = "bread"  # Even if there's a typo or different case, it should correct
    suggestions = predict_next_foods(current_food)
    print(f"Suggested foods to pair with {current_food}: {suggestions}")
