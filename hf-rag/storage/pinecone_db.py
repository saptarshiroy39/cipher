from pinecone import Pinecone
from config import get_settings

_index = None


def _get_index():
    global _index
    if not _index:
        pc = Pinecone(api_key=get_settings().pinecone_api_key)
        _index = pc.Index(get_settings().pinecone_index_name)
    return _index


def upsert(vectors: list, namespace: str):
    idx = _get_index()
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        idx.upsert(vectors=vectors[i:i+batch_size], namespace=namespace)
    return len(vectors)


def query(embedding: list, namespace: str, top_k: int = 5) -> list:
    results = _get_index().query(
        vector=embedding,
        namespace=namespace,
        top_k=top_k,
        include_metadata=True
    )
    return [
        {"text": m.get("metadata", {}).get("text", ""), "score": m["score"]}
        for m in results.get("matches", [])
    ]


def delete_namespace(namespace: str):
    _get_index().delete(delete_all=True, namespace=namespace)


def get_stats(namespace: str) -> dict:
    stats = _get_index().describe_index_stats()
    ns = stats.get("namespaces", {}).get(namespace, {})
    return {"namespace": namespace, "vectors": ns.get("vector_count", 0)}
