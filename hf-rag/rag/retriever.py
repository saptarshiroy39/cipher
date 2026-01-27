from storage.embedding import embed_query, embed_documents
from storage.pinecone_db import upsert, query, delete_namespace


class Retriever:
    def __init__(self, user_id: str, chat_id: str = None):
        self.namespace = f"{user_id}_{chat_id}" if chat_id else user_id
    
    def ingest(self, chunks: list[str], source: str = "upload"):
        if not chunks:
            return 0
        
        embeddings = embed_documents(chunks)
        vectors = [
            {
                "id": f"{self.namespace}-{i}",
                "values": emb,
                "metadata": {"text": chunk, "source": source}
            }
            for i, (chunk, emb) in enumerate(zip(chunks, embeddings))
            if emb
        ]
        return upsert(vectors, self.namespace)
    
    def search(self, question: str, k: int = 10) -> list[str]:
        emb = embed_query(question)
        results = query(emb, self.namespace, top_k=k)
        return [r["text"] for r in results if r["text"]]
    
    def clear(self):
        delete_namespace(self.namespace)
