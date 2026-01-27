from .retriever import Retriever
from llm.gemini import LLMClient


def ingest(chunks: list, user_id: str, chat_id: str = None):
    r = Retriever(user_id, chat_id)
    return r.ingest(chunks)


def ask(question: str, user_id: str, chat_id: str = None, api_key: str = None) -> dict:
    r = Retriever(user_id, chat_id)
    results = r.search(question, k=10)
    
    if not results:
        return {"answer": "No relevant info found. Try uploading more files.", "context": ""}
    
    context = "\n\n".join(results)
    llm = LLMClient(api_key)
    answer = llm.get_answer_chain().invoke({"context": context, "question": question})
    
    return {"answer": answer, "context": context}


def clear(user_id: str, chat_id: str = None):
    Retriever(user_id, chat_id).clear()
