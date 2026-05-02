import re

def split_sentences(text: str) -> list[str]:
    # Splits on period followed by space or end of string
    raw_sentences = re.split(r'\.\s+|\.$', text)
    
    # Strip whitespace and filter empty strings
    sentences = []
    for s in raw_sentences:
        stripped = s.strip()
        if stripped:
            sentences.append(stripped + ".")
            
    return sentences
