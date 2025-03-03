import pandas as pd
import joblib
from rapidfuzz import process  # For fuzzy matching

# Load dataset
df = pd.read_csv("ML/patterns.csv")

# Convert to lowercase and split into lists
df["FoodsConsumedTogether"] = df["FoodsConsumedTogether"].apply(lambda x: [food.lower() for food in x.split(", ")])
df["Frequency"] = df["Frequency"].astype(int)  # Convert frequency to int

# Build Markov Chain transition matrix
transitions = {}

for _, row in df.iterrows():
    sequence = row["FoodsConsumedTogether"]
    frequency = row["Frequency"]  # Use frequency as weight

    for i in range(len(sequence) - 1):
        curr_food, next_food = sequence[i], sequence[i + 1]

        if curr_food not in transitions:
            transitions[curr_food] = {}

        if next_food not in transitions[curr_food]:
            transitions[curr_food][next_food] = 0

        transitions[curr_food][next_food] += frequency  # Weighted count

# Normalize transition probabilities
for food, next_foods in transitions.items():
    total = sum(next_foods.values())
    transitions[food] = {k: v / total for k, v in next_foods.items()}

# Save Markov Chain model
joblib.dump(transitions, "ML/markov_food_model.pkl")

# Save all unique food items (for fuzzy matching)
food_list = list(transitions.keys())
joblib.dump(food_list, "ML/food_list.pkl")

print("Markov Chain Model Trained & Saved!")
