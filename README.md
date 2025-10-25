DPKS AI – Creative Assistant (Powered by Gemini 2.5 Flash)

Description:
DPKS AI is a Flask-based creative assistant that helps users generate stories, lyrics, and artistic ideas using the Gemini 2.5 Flash model. The app includes a chat-style interface with creative modes, multiple writing styles, language options, and typing animations. It supports dark and light themes, session-based conversation saving, and a patch notes popup.

Key Features:

Interactive chat interface with user and assistant message bubbles

Powered by Gemini 2.5 Flash for fast and imaginative responses

Creative output modes including Story mode and Music/Lyric mode

Writing styles: Normal, Funny, Dark, Poetic, Epic

Supports multiple languages: Vietnamese, English, Japanese

Animated typewriter-style AI responses

Stop button to cancel response generation

Auto-scroll and typing indicator

Dark mode with saved user preference

Session-based message history

Patch Notes popup for updates

Clear conversation button

Project Structure:
ai_assistant/
|-- static/
| |-- script.js
| |-- style.css
|-- templates/
| |-- index.html
|-- app.py
|-- requirements.txt
|-- .env (not included)
|-- .gitignore
|-- README.md

Setup and Installation:

Clone the repository
git clone https://github.com/your-username/ai_assistant.git

cd ai_assistant

Create and activate a virtual environment
python -m venv venv
For Mac or Linux: source venv/bin/activate
For Windows: venv\Scripts\activate

Install dependencies
pip install -r requirements.txt

Create a .env file in the project root with the following:
GEMINI_API_KEY=your_api_key_here
SECRET_KEY=your_flask_secret

Run the application
python app.py

After starting the app, open your browser and go to:
http://127.0.0.1:5000

API Endpoints:
Method: POST, Endpoint: /api/generate, Description: Generates AI response based on the provided prompt and settings
Method: POST, Endpoint: /api/stop, Description: Cancels the current response generation
Method: POST, Endpoint: /clear, Description: Clears the current session's conversation
Method: GET, Endpoint: /, Description: Loads the main chat user interface

Patch Notes (Latest version 2.x):

Added Gemini 2.5 Flash integration

Added stop generation button

Added dark mode with saved preferences

Improved response typing animation

Added Patch Notes popup feature

Improved session handling and clearing

Environment and Security Notes:

A valid .env file is required for the application to work

Do not commit the venv directory or API keys to version control

The .gitignore file is configured to exclude sensitive and unnecessary files
