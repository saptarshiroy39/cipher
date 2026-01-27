from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config import get_settings

PROMPT = """You are a helpful document assistant. Answer using ONLY the provided context.

Rules:
1. Use ONLY the context below. No outside knowledge.
2. Cite page numbers like `[Page 2]` when referencing info.
3. Format with Markdown (headers, bullets, bold).
4. If answer not in context: "I cannot find that in the documents."

Context: {context}

Question: {question}

Answer:"""


class LLMClient:
    def __init__(self, api_key: str = None):
        key = api_key or get_settings().gemini_api_key
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=key,
            temperature=0.3
        )
    
    def get_answer_chain(self):
        prompt = PromptTemplate.from_template(PROMPT)
        return prompt | self.llm | StrOutputParser()
