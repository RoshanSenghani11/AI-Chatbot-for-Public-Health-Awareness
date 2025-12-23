from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langdetect import detect
from deep_translator import GoogleTranslator

# Supported languages map
SUPPORTED_LANGS = {
    "en": "english",
    "hi": "hindi",
    "bn": "bengali",
    "hn": "hinglish",
    "pa": "punjabi",
    "or": "odia",
    "ml": "malayalam",
    "te": "telugu",
    "gu": "gujarati",
    "bho": "bhojpuri"   # may fallback, langdetect sometimes detects as 'hi'
}

# Extract the data from the PDF file 
def load_pdf_file(data):
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    documents = loader.load()
    return documents

# Split the Data into text Chunks
def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks

# Download the Embeddings from Hugging Face
def download_hugging_face_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return embeddings

# ------------------------------
# Multilingual Support Helpers
# ------------------------------

def detect_language(text: str) -> str:
    """Detect the input language (default English if unknown)."""
    try:
        lang = detect(text)
        return lang if lang in SUPPORTED_LANGS else "en"
    except:
        return "en"

def translate_to_english(text: str, src_lang: str) -> str:
    """Translate text to English before embedding/retrieval."""
    if src_lang == "en":
        return text
    return GoogleTranslator(source=src_lang, target="en").translate(text)

def translate_from_english(text: str, target_lang: str) -> str:
    """Translate model response back to user’s language."""
    if target_lang == "en":
        return text
    return GoogleTranslator(source="en", target=target_lang).translate(text)