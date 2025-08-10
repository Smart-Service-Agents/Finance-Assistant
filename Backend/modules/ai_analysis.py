import os, json, re

# from gpt4all import GPT4All

class AI:
    def __init__(self):
        pass
        # self.model = GPT4All("mistral-7b-instruct-v0.1.Q4_0.gguf", device="cpu")

    def strip_code_block(self, text):
        """
        Strips ```json ... ``` or ``` ... ``` wrappers if present
        """
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?", "", text, flags=re.IGNORECASE).strip()
        if text.endswith("```"):
            text = re.sub(r"```$", "", text).strip()
        return text


def generate_insights(self, formatted_analysis):
    import google.generativeai as genai
    try:
        genai.configure(api_key=os.getenv("GENAI_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        You are an AI assistant for a hotel management dashboard.

        Based on the following data:
        - Guest Experience Data: {formatted_analysis['guestExperienceData']}
        - Review Reactions: {formatted_analysis['reviewReactions']}

        Generate 5 to 7 insights in the following JSON format:

        [
          {{
            "id": "1",
            "title": "Insight title",
            "description": "What the insight is and what to do about it.",
            "priority": "high" | "medium" | "low",
            "category": "Facilities" | "Tech" | "Service" | "F&B" | "Amenities",
            "impact": "High" | "Medium" | "Low",
            "timeframe": "Now" | "1 month" | "3-6 months" | etc.
          }},
          ...
        ]

        Return ONLY the JSON array and nothing else.
        """

        # with self.model.chat_session():
        #     response = self.model.generate(prompt, max_tokens=1024)
        
        response = model.generate_content(prompt)

        cleaned_text = self.strip_code_block(response.text)
        insights = json.loads(cleaned_text)
        return { "aiInsights": insights }

    except Exception as e:
        print(f"[AI Insight Generation Error] {e}")
        return { "aiInsights": [] }
