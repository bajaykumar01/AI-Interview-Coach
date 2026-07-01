import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()
MODEL_NAME = "gemini-2.5-flash"

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set. Please add it to your .env file.")
        _client = genai.Client(api_key=api_key)
    return _client


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

    response = get_client().models.generate_content(
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
def generate_question(role, difficulty, resume_text=None):
    if resume_text:
        resume_context = f"\nCandidate Resume Context:\n{resume_text}\n"
        personalization = "The question MUST be personalized based on the candidate's resume (focusing on their skills, projects, experience, technologies, and certifications where relevant to the role)."
    else:
        resume_context = ""
        personalization = ""

    prompt = f"""
You are an expert technical interviewer.

Generate ONE interview question.

Role: {role}
Difficulty: {difficulty}
{resume_context}
Instructions:
- Return ONLY the question text.
- {personalization}
"""

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()


def generate_next_question(
    role,
    difficulty,
    previous_question,
    previous_answer,
    score,
    resume_text=None
):
    if resume_text:
        resume_context = f"\nCandidate Resume Context:\n{resume_text}\n"
        personalization = "Ensure the next question continues to be personalized based on the candidate's resume (skills, projects, experience, technologies, and certifications) while adapting to the flow of the interview."
    else:
        resume_context = ""
        personalization = ""

    prompt = f"""
You are an expert technical interviewer.

Role:
{role}

Difficulty:
{difficulty}
{resume_context}
Previous Question:
{previous_question}

Candidate Answer:
{previous_answer}

Score:
{score}/10

Generate ONE new interview question.

Instructions:
- If the score is high, increase the difficulty slightly.
- If the score is low, ask another question from the same topic.
- {personalization}
- Return ONLY the question.
"""

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()


from pydantic import BaseModel, Field

class AnalysisReportSchema(BaseModel):
    overall_score: float = Field(description="Overall score based on answers, on a scale of 1.0 to 10.0")
    strengths: list[str] = Field(description="List of candidate's technical strengths demonstrated in the interview")
    weak_topics: list[str] = Field(description="List of technical topics or concepts where candidate demonstrated weakness or made errors")
    communication_rating: str = Field(description="Communication rating (e.g. 'Excellent', 'Good', 'Needs improvement') with brief explanation")
    confidence_rating: str = Field(description="Confidence level rating (e.g. 'High', 'Moderate', 'Low') with brief explanation")
    technical_accuracy: str = Field(description="Technical accuracy rating (e.g. '85%' or 'High accuracy') with brief explanation")
    recommended_topics: list[str] = Field(description="Specific learning topics recommended to study")
    suggestions: list[str] = Field(description="Actionable personalized improvement suggestions")

def generate_interview_report(role: str, difficulty: str, QA_history: list[dict]) -> dict:
    history_text = ""
    for idx, item in enumerate(QA_history):
        history_text += f"""
--- Question {idx+1} ---
Question: {item['question']}
Answer: {item['answer']}
Score: {item['score']}/10
Feedback: {item['feedback']}
"""

    prompt = f"""
You are an expert technical interviewer and talent assessor.
Analyze the candidate's complete interview performance for the role of '{role}' at '{difficulty}' difficulty.

Interview Transcript & Evaluations:
{history_text}

Provide a comprehensive, detailed final analysis report based on their performance.
"""

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AnalysisReportSchema,
        }
    )

    return json.loads(response.text)


class ResumeProfileSchema(BaseModel):
    skills: list[str] = Field(description="List of key technical or professional skills present in the resume")
    summary: str = Field(description="A concise 2-sentence summary of the candidate's career background and projects")
    recommended_role: str = Field(description="A single recommended job role or title matching their profile (e.g. Java Developer, React Engineer, Data Scientist)")

def extract_resume_profile(resume_text: str) -> dict:
    prompt = f"""
You are an expert recruiter and technical assessor.
Analyze the candidate's resume text below and extract:
1. A list of key technical/professional skills.
2. A short, concise 2-sentence summary of their background, key experience, and key projects.
3. The most suitable target job role or title (e.g. 'Python Developer', 'React Developer', 'Machine Learning Engineer', etc.) based on their profile.

Resume Text:
{resume_text}
"""

    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeProfileSchema,
        }
    )

    return json.loads(response.text)