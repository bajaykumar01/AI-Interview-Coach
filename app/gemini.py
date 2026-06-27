import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()
print("Loaded API Key:", os.getenv("GEMINI_API_KEY"))
API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-2.5-flash"


def evaluate_answer(question: str, answer: str):

    prompt = f"""
You are an experienced technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return ONLY valid JSON in this format:

{{
    "score": 8,
    "feedback": "Good answer. Mentioned most important concepts."
}}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    result = response.text

    # Remove markdown if Gemini returns it
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    print(result)

    return json.loads(result)
def generate_question(role, difficulty):
    prompt = f"""
You are an expert technical interviewer.

Generate ONE interview question.

Role: {role}
Difficulty: {difficulty}

Return ONLY the question text.
"""

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
    )

    return response.text.strip()
def generate_next_question(
    role,
    difficulty,
    previous_question,
    previous_answer,
    score
):
    prompt = f"""
You are an expert technical interviewer.

Role:
{role}

Difficulty:
{difficulty}

Previous Question:
{previous_question}

Candidate Answer:
{previous_answer}

Score:
{score}/10

Generate ONE new interview question.

If the score is high,
increase the difficulty slightly.

If the score is low,
ask another question from the same topic.

Return ONLY the question.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()