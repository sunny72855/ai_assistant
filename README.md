🚀 DPKS AI – Creative Assistant (Powered by Gemini 2.5 Flash)

DPKS AI is a Flask-based creative assistant that helps users generate stories, lyrics, and artistic ideas using Gemini 2.5 Flash. Featuring a sleek chat UI, multiple creative styles, multilingual support, dark mode, and session-based conversations, this app is designed for a smooth and engaging AI experience.

✨ Features

✅ Interactive Chat UI with user/assistant bubbles
✅ Gemini 2.5 Flash for fast, high-quality responses
✅ Creative modes:
    📖 Story mode
    🎵 Music/Lyric mode
✅ Writing styles: Normal • Funny • Dark • Poetic • Epic
✅ Language options: 🇻🇳 Vietnamese • 🇺🇸 English • 🇯🇵 Japanese
✅ Typewriter-style AI response animation
✅ Stop generation anytime ⏹
✅ Auto-scroll & typing indicator
✅ Dark/Light mode toggle (saves preference) 🌗
✅ Session-based message history
✅ Patch Notes popup 📝
✅ Clear conversation instantly 🧹

📦 Tech Stack
Component	Technology
Backend	Flask (Python)
Frontend	HTML, CSS, JavaScript
AI Model	Gemini 2.5 Flash (via Google Generative Language API)
Styling	Custom CSS
Markdown Rendering	Marked.js
Environment Handling	python-dotenv
📁 Project Structure
ai_assistant/
├── api/ (if used in future)
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── app.py
├── .env (not committed)
├── .gitignore
└── README.md

🔧 Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/ai_assistant.git
cd ai_assistant

2️⃣ Create & activate virtual environment
python -m venv venv
source venv/bin/activate     # Mac/Linux
venv\Scripts\activate        # Windows

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Add your .env file

Create a .env file with:

GEMINI_API_KEY=your_api_key_here
SECRET_KEY=your_flask_secret

5️⃣ Run the app
python app.py


Open in your browser:
👉 http://127.0.0.1:5000

📤 API Endpoints
Method	Endpoint	Description
POST	/api/generate	Generates AI response based on prompt, category, style, and language
POST	/api/stop	Cancels current generation
POST	/clear	Clears session chat history
GET	/	Renders chat UI
📣 Patch Notes (Latest v2.x)

✅ Gemini 2.5 Flash integration
✅ Stop button for instant cancellation
✅ Dark mode with memory
✅ Typing animation & better UI feedback
✅ Patch Notes modal added
✅ Improved conversation handling

🛡️ Environment & Security Notes

🔒 .env file is required for API access
🚫 Never commit your venv/ or secrets
✅ Already handled via .gitignore
