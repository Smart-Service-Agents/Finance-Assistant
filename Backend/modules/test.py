from llama_cpp import Llama

# Load the model locally
llm = Llama(
    model_path="mistral-7b-instruct-v0.2.Q4_K_M.gguf", 
    n_ctx=2048, 
    n_threads=6  # adjust to your CPU cores
)

# Prompt
prompt = """
You are an AI assistant for hotel management.
Summarize the following reviews into JSON insights:

Reviews:
- Room was clean but WiFi slow.
- Breakfast was amazing, but pool was cold.

Output JSON:
"""

output = llm(prompt, max_tokens=512, stop=["]"])

print(output["choices"][0]["text"])
