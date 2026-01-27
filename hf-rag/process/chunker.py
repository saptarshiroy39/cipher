from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk(text: str, size: int = 1500, overlap: int = 150) -> list[str]:
    if not text:
        return []
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=size,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    return splitter.split_text(text)
