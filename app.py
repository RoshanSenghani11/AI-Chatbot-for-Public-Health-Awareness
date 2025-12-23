from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import logging

from src.helper import (
    download_hugging_face_embeddings, 
    detect_language, 
    translate_to_english, 
    translate_from_english
)

from langchain_deepseek import ChatDeepSeek

from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_pinecone import Pinecone

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import prompt, with fallback
try:
    from src.prompt import *
except ImportError:
    logger.warning("src.prompt not found, using default prompt")
    system_prompt = """You are a helpful medical assistant. Provide accurate and helpful medical information based on the context provided. If you don't know the answer based on the context, say so."""
except Exception as e:
    logger.error(f"Error importing prompt: {e}")
    system_prompt = """You are a helpful medical assistant. Provide accurate and helpful medical information."""

app = Flask(__name__)   
load_dotenv()

# Load API keys from environment
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")

# Validate environment variables
if not PINECONE_API_KEY:
    logger.error("PINECONE_API_KEY not found in environment variables")
if not DEEPSEEK_API_KEY:
    logger.error("DEEPSEEK_API_KEY not found in environment variables")

if PINECONE_API_KEY:
    os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
if DEEPSEEK_API_KEY:
    os.environ["DEEPSEEK_API_KEY"] = DEEPSEEK_API_KEY

# Initialize components
rag_chain = None
try:
    # Load embeddings
    logger.info("Loading Hugging Face embeddings...")
    embeddings = download_hugging_face_embeddings()

    # Pinecone index setup
    index_name = "medibot"
    logger.info(f"Connecting to Pinecone index: {index_name}")
    docsearch = Pinecone.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
    )

    retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

    # Initialize DeepSeek LLM
    logger.info("Initializing DeepSeek LLM...")
    llm = ChatDeepSeek(
        model="deepseek-chat",
        temperature=0.4,
        max_tokens=500
    )

    # CORRECTED Prompt setup
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{question}"),
    ])


    # Create the RAG chain
    logger.info("Creating RAG chain...")
    document_chain = (
        prompt
        | llm
        | StrOutputParser()
    )
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | document_chain
    )
    logger.info("Application initialized successfully")

except Exception as e:
    logger.error(f"Error during initialization: {e}")
    rag_chain = None

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/get', methods=['POST'])
def chat():
    if rag_chain is None:
        logger.error("RAG chain not initialized")
        return jsonify({
            "answer": "Service temporarily unavailable. Please try again later.",
            "detected_language": "en",
            "error": True
        })
    
    try:
        user_input = request.form.get('msg', '').strip()
        
        if not user_input:
            return jsonify({
                "answer": "Please enter a question.",
                "detected_language": "en",
                "error": True
            })
        
        logger.info(f"Received question: {user_input}")
        
        # Detect user's language
        detected_lang = detect_language(user_input)
        logger.info(f"Detected language: {detected_lang}")
        
        # Translate non-English queries to English for retrieval
        if detected_lang != "en":
            try:
                english_query = translate_to_english(user_input, detected_lang)
                logger.info(f"Translated to English: {english_query}")
            except Exception as translation_error:
                logger.error(f"Translation error: {translation_error}")
                english_query = user_input
                detected_lang = "en"
        else:
            english_query = user_input
        
        # Get response from RAG chain (in English)
        logger.info("Querying RAG chain...")
        english_answer = rag_chain.invoke(english_query)
        logger.info(f"RAG response: {english_answer}")
        
        # Translate response back to user's language if needed
        if detected_lang != "en":
            try:
                final_answer = translate_from_english(english_answer, detected_lang)
                logger.info("Translated response back to user's language")
            except Exception as translation_error:
                logger.error(f"Response translation error: {translation_error}")
                final_answer = english_answer
                detected_lang = "en"
        else:
            final_answer = english_answer
        
        return jsonify({
            "answer": final_answer,
            "detected_language": detected_lang,
            "original_question": user_input,
            "english_question": english_query if detected_lang != "en" else user_input,
            "error": False
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "answer": "Sorry, I encountered an error while processing your request. Please try again.",
            "detected_language": "en",
            "error": True
        })

# Add the debug endpoint
@app.route('/debug-retrieval', methods=['POST'])
def debug_retrieval():
    """Debug endpoint to see what's being retrieved"""
    if rag_chain is None:
        return jsonify({"error": "RAG chain not initialized"})
    
    try:
        user_input = request.form.get('msg', '').strip()
        if not user_input:
            return jsonify({"error": "No message provided"})
        
        # Test direct retrieval
        docs = retriever.invoke(user_input)
        
        retrieved_context = []
        for i, doc in enumerate(docs):
            retrieved_context.append({
                "doc_number": i + 1,
                "content_preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "metadata": doc.metadata
            })
        
        # Test full RAG chain
        response = rag_chain.invoke(user_input)

        return jsonify({
            "query": user_input,
            "retrieved_documents": retrieved_context,
            "rag_answer": response,
            "context_used": len(retrieved_context) > 0
        })  

        
    except Exception as e:
        logger.error(f"Debug error: {e}")
        return jsonify({"error": str(e)})

@app.route('/languages', methods=['GET'])
def get_supported_languages():
    """Endpoint to get supported languages"""
    try:
        from src.helper import SUPPORTED_LANGS
        return jsonify({
            "supported_languages": SUPPORTED_LANGS,
            "error": False
        })
    except ImportError:
        return jsonify({
            "supported_languages": {"en": "english"},
            "error": True,
            "message": "Could not load supported languages"
        })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy" if rag_chain is not None else "unhealthy",
        "rag_chain_initialized": rag_chain is not None,
        "pinecone_configured": PINECONE_API_KEY is not None,
        "deepseek_configured": DEEPSEEK_API_KEY is not None
    })

# New endpoints for frontend integration
@app.route('/api/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    """Endpoint for symptom analysis from frontend"""
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', '').strip()
        language = data.get('language', 'en')
        
        if not symptoms:
            return jsonify({
                "analysis": "Please describe your symptoms.",
                "error": True
            })
        
        # Use the existing chat logic
        response = chat_internal(symptoms, language)
        
        return jsonify({
            "analysis": response["answer"],
            "detected_language": response["detected_language"],
            "error": False
        })
        
    except Exception as e:
        logger.error(f"Error in analyze-symptoms: {e}")
        return jsonify({
            "analysis": "Sorry, I encountered an error while analyzing your symptoms. Please try again.",
            "error": True
        })

def chat_internal(user_input, language='en'):
    """Internal chat function for reuse"""
    if rag_chain is None:
        return {
            "answer": "Service temporarily unavailable. Please try again later.",
            "detected_language": language,
            "error": True
        }
    
    try:
        # Detect user's language if not specified
        if language == 'auto':
            detected_lang = detect_language(user_input)
        else:
            detected_lang = language
        
        # Translate non-English queries to English for retrieval
        if detected_lang != "en":
            try:
                english_query = translate_to_english(user_input, detected_lang)
            except Exception:
                english_query = user_input
                detected_lang = "en"
        else:
            english_query = user_input
        
        # Get response from RAG chain
        english_answer = rag_chain.invoke(english_query)
        
        # Translate response back to user's language if needed
        if detected_lang != "en":
            try:
                final_answer = translate_from_english(english_answer, detected_lang)
            except Exception:
                final_answer = english_answer
                detected_lang = "en"
        else:
            final_answer = english_answer
        
        return {
            "answer": final_answer,
            "detected_language": detected_lang,
            "error": False
        }
        
    except Exception as e:
        logger.error(f"Error in chat_internal: {e}")
        return {
            "answer": "Sorry, I encountered an error while processing your request.",
            "detected_language": language,
            "error": True
        }

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Mock OTP endpoint for frontend"""
    return jsonify({"success": True, "message": "OTP sent successfully"})

@app.route('/api/login', methods=['POST'])
def login():
    """Mock login endpoint for frontend"""
    return jsonify({"success": True, "message": "Login successful"})

@app.route('/api/signup', methods=['POST'])
def signup():
    """Mock signup endpoint for frontend"""
    return jsonify({"success": True, "message": "Signup successful"})

@app.route('/api/contact', methods=['POST'])
def contact():
    """Mock contact endpoint for frontend"""
    return jsonify({"success": True, "message": "Message sent successfully"})

@app.route('/api/save-history', methods=['POST'])
def save_history():
    """Mock history endpoint for frontend"""
    return jsonify({"success": True, "message": "History saved"})

if __name__ == '__main__':
    logger.info("Starting Flask application...")
    app.run(host="0.0.0.0", port=5001, debug=True)