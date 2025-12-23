# Future-Titans
# 🏥 AI Health Chatbot - Future Titans

A intelligent health assistant powered by AI that provides medical information, symptom analysis, and health guidance using natural language processing.

![Health Chatbot](https://img.shields.io/badge/Health-AI%20Assistant-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey)

## 🌟 Features

- *🤖 Intelligent Health Assistance*: Get AI-powered responses to health-related questions
- *🔍 Symptom Analysis*: Describe symptoms and receive potential insights
- *💊 Medication Information*: Learn about medications and their uses
- *🏥 Healthcare Guidance*: Receive general health advice and recommendations
- *🔒 Privacy-Focused*: Your health conversations stay secure
- *🌐 Web Interface*: User-friendly chat interface
- *⚡ Real-time Responses*: Instant AI-powered answers

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. *Clone the repository*
   bash
   git clone https://github.com/your-username/Future-Titans-main.git
   cd Future-Titans-main

Create and activate virtual environment

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate


Install dependencies

pip install -r requirements.txt
pip install flask langchain langchain-community langchain-huggingface sentence-transformers transformers torch faiss-cpu

Run the application

python app.py

Open your browser and navigate to http://localhost:5000


Fix Flask ModuleNotFoundError in Python
(venv) PS C:\Users\Admin\Downloads\Future-Titans-main> python app.py
Traceback (most recent call last):
  File "C:\Users\Admin\Downloads\Future-Titans-main\app.py", line 1, in <module>
    from flask import Flask, render_template, request, jsonify
ModuleNotFoundError: No module named 'flask'
This error occurs because the Flask module is not installed in your Python environment. Here are several ways to fix this:

Solution 1: Install Flask using pip
bash
pip install flask
Solution 2: If you're using a virtual environment (recommended)
Since you're in a virtual environment (venv), make sure it's activated and install Flask:

bash
# Activate the virtual environment (if not already activated)
venv\Scripts\activate

# Install Flask
pip install flask
Solution 3: Install from requirements file (if available)
If the project has a requirements.txt file:

bash
pip install -r requirements.txt
Solution 4: Create and use a new virtual environment
bash
# Create new virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install Flask
pip install flask
Solution 5: If you're having permission issues
bash
# On Windows
python -m pip install flask

# Or if using Python 3 specifically
python3 -m pip install flask
Additional troubleshooting steps:
Check if pip is working:

bash
pip --version
Check Python version:

bash
python --version
If multiple Python versions are installed, try:

bash
py -m pip install flask
For complete project setup, also install other common dependencies:

bash
pip install flask flask-sqlalchemy flask-wtf flask-login
Verify the installation:
After installing Flask, verify it worked by running:

bash
python -c "import flask; print(flask.__version__)"
Then try running your app again:

bash
python app.py
The most likely solution is Solution 2 since you're already in a virtual environment. Just run pip install flask and your app should work!

(venv) PS C:\Users\Admin\Downloads\Future-Titans-main> python app.py
Traceback (most recent call last):
  File "C:\Users\Admin\Downloads\Future-Titans-main\app.py", line 2, in <module>
    from src.helper import (
    ...<4 lines>...
    )
  File "C:\Users\Admin\Downloads\Future-Titans-main\src\helper.py", line 3, in <module>
    from langchain_huggingface import HuggingFaceEmbeddings
ModuleNotFoundError: No module na
The error shows that there are multiple missing dependencies. The project requires several libraries that aren't installed. Here's how to fix this:

Solution 1: Install all required dependencies
Since this appears to be a LangChain project, install the main dependencies:

bash
pip install langchain langchain-community langchain-huggingface sentence-transformers
Solution 2: Install specific missing modules
Based on the error, install these specifically:

bash
pip install langchain-huggingface sentence-transformers
Solution 3: Complete installation for AI/ML projects
bash
pip install langchain langchain-community langchain-huggingface sentence-transformers transformers torch torchvision torchaudio faiss-cpu
Solution 4: Install from requirements.txt (if available)
Check if there's a requirements.txt file in the project:

bash
# Install from requirements file
pip install -r requirements.txt

# Or if you have a different requirements file name
pip install -r requirements.txt
Solution 5: Install common data science/AI stack
bash
pip install numpy pandas matplotlib seaborn scikit-learn jupyter
pip install langchain langchain-community transformers sentence-transformers
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install faiss-cpu
Solution 6: If you're still having issues, try this comprehensive approach:
bash
# Core web framework
pip install flask

# AI/ML dependencies
pip install langchain
pip install langchain-community
pip install langchain-huggingface
pip install sentence-transformers
pip install transformers

# Optional but commonly needed
pip install numpy
pip install pandas
pip install scikit-learn
To verify the installation:
After installing, test the imports:

bash
python -c "from langchain_huggingface import HuggingFaceEmbeddings; print('Success!')"
If you continue to have issues:
Check the project documentation - Look for a README.md file that might list specific requirements

Look for setup instructions - There might be special installation steps for this particular project

Check Python version - Make sure you're using Python 3.8+ (recommended for LangChain)

Try Solution 3 first as it covers the most common dependencies for LangChain projects with HuggingFace integration. After installation, run your app again:

bash
python app.py
The project should now start without the module import errors!

write a Readme.md file for github for the ai health chatbot project
Here's a comprehensive README.md file for your AI Health Chatbot project:

markdown
# 🏥 AI Health Chatbot - Future Titans

A intelligent health assistant powered by AI that provides medical information, symptom analysis, and health guidance using natural language processing.

![Health Chatbot](https://img.shields.io/badge/Health-AI%20Assistant-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey)

## 🌟 Features

- **🤖 Intelligent Health Assistance**: Get AI-powered responses to health-related questions
- **🔍 Symptom Analysis**: Describe symptoms and receive potential insights
- **💊 Medication Information**: Learn about medications and their uses
- **🏥 Healthcare Guidance**: Receive general health advice and recommendations
- **🔒 Privacy-Focused**: Your health conversations stay secure
- **🌐 Web Interface**: User-friendly chat interface
- **⚡ Real-time Responses**: Instant AI-powered answers

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   bash
   git clone https://github.com/your-username/Future-Titans-main.git
   cd Future-Titans-main
Create and activate virtual environment

bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
Install dependencies

bash
pip install -r requirements.txt
If requirements.txt is not available, install manually:

bash
pip install flask langchain langchain-community langchain-huggingface sentence-transformers transformers torch faiss-cpu
Run the application

bash
python app.py
Access the application
Open your browser and navigate to http://localhost:5000

🛠 Technology Stack
Backend
Flask - Web framework

LangChain - AI orchestration framework

HuggingFace Transformers - NLP models

Sentence Transformers - Text embeddings

Frontend
HTML5/CSS3 - Structure and styling

JavaScript - Interactive features

Bootstrap (optional) - UI components

AI/ML
Pre-trained Language Models - For natural language understanding

Embedding Models - For semantic search

FAISS - Vector database for efficient similarity search