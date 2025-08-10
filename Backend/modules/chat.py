import os

class Chat:
    def __init__(self):
        self.GEMINI = os.getenv("GENAI_KEY")
        pass

    def answer_question(self, reviews, question):
        import google.generativeai as genai
        # from gpt4all import GPT4All
        genai.configure(api_key=self.GEMINI)

        # model = GPT4All("mistral-7b-instruct-v0.1.Q4_0.gguf", device="cpu")
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        You are a hotel review analysis assistant.

        You are given a list of guest reviews. Each review includes:
        - The review text
        - A rating out of 5
        - The date it was written

        Based on these reviews, answer the manager's question in a useful and insightful way.

        Question:
        {question}

        Reviews:
        {reviews}

        Only use the reviews to answer. Be clear and concise.
        """

        try:
            # with model.chat_session():
            #     response = model.generate(prompt)

            response = model.generate_content(prompt)
            return {
                "content": response.text,
                "suggestions": []
            }
        except Exception as e:
            print(f"[Gemini ERROR] {e}")
            raise