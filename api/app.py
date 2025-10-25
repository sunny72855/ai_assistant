import os
import requests
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from dotenv import load_dotenv
from datetime import timedelta

# load env
load_dotenv()

app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(__file__), "../templates"),
    static_folder=os.path.join(os.path.dirname(__file__), "../static")
)

# Secret key for session — set in .env for production. Default for dev only.
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
app.permanent_session_lifetime = timedelta(days=7)

# Gemini config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "models/gemini-2.5-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

def ensure_session():
    """Initialize messages list in session."""
    session.permanent = True
    if "messages" not in session:
        # messages: list of {role: "user"|"assistant"|"system", text: "..."}
        session["messages"] = []

@app.route("/")
def index():
    ensure_session()
    return render_template("index.html", messages=session.get("messages", []))

@app.route("/api/generate", methods=["POST"])
@app.route("/api/generate", methods=["POST"])
def api_generate():
    ensure_session()
    data = request.get_json(force=True) or {}
    prompt = (data.get("prompt") or "").strip()
    category = data.get("category", "story")
    style = data.get("style", "normal")
    language = data.get("language", "vi")

    if not prompt:
        return jsonify({"ok": False, "error": "Empty prompt"}), 400

    # language prompts
    lang_prompts = {
        "vi": "Hãy trả lời bằng tiếng Việt.",
        "en": "Please respond in English.",
        "ja": "日本語で答えてください。"
    }

    # style prompts (now with per-language translations)
    style_prompts = {
        "normal": {"vi":"Viết theo phong cách bình thường.", "en":"Write in a normal style."},
        "funny": {"vi":"Hãy làm cho nội dung trở nên hài hước và vui nhộn.", "en":"Make it funny and playful."},
        "dark": {"vi":"Viết theo phong cách u tối, bí ẩn và có chiều sâu.", "en":"Write in a dark, mysterious style."},
        "poetic": {"vi":"Viết theo phong cách thơ ca, đầy cảm xúc và hình ảnh.", "en":"Write in a poetic, vivid style."},
        "epic": {"vi":"Viết theo phong cách sử thi, mạnh mẽ và hoành tráng.", "en":"Write in an epic, grand style."}
    }

    # base content
    if category == 'story':
        base = f"Hãy viết một câu chuyện dựa trên ý tưởng: {prompt}." if language=="vi" else f"Write a story based on this idea: {prompt}."
    elif category == 'music':
        base = f"Hãy sáng tác lời bài hát hoặc gợi ý nhạc dựa trên: {prompt}." if language=="vi" else f"Compose song lyrics or music ideas based on: {prompt}."
    elif category == 'art':
        base = f"Hãy tạo một ý tưởng nghệ thuật hoặc hướng dẫn sáng tạo dựa trên: {prompt}." if language=="vi" else f"Create an art idea or creative guide based on: {prompt}."
    else:
        base = prompt

    # combine language + style + base
    user_input = f"{lang_prompts.get(language,'')} {style_prompts.get(style,{}).get(language,'')} {base}"

    # store user message
    messages = session.get("messages", [])
    messages.append({"role": "user", "text": prompt})
    session["messages"] = messages

    # Gemini payload
    payload = {
        "contents": [{"parts":[{"text": user_input}]}]
    }
    headers = {"Content-Type": "application/json"}

    try:
        res = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=60)
        res.raise_for_status()
        data = res.json()
    except requests.RequestException as e:
        return jsonify({"ok": False, "error": f"Request error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"ok": False, "error": f"Parse error: {str(e)}"}), 500

    # extract assistant text
    assistant_text = ""
    try:
        if "candidates" in data and len(data["candidates"])>0:
            c = data["candidates"][0]
            if "content" in c and "parts" in c["content"] and len(c["content"]["parts"])>0:
                assistant_text = c["content"]["parts"][0].get("text","")
        if not assistant_text:
            assistant_text = "No response from model."
    except Exception:
        assistant_text = "Error parsing model response."

    # store assistant message
    messages.append({"role": "assistant", "text": assistant_text})
    session["messages"] = messages

    return jsonify({"ok": True, "assistant": assistant_text})


@app.route("/clear", methods=["POST"])
def clear():
    session.pop("messages", None)
    return jsonify({"ok": True})

if __name__ == "__main__":
    # quick dev note:
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY is not set. Put it in your .env file (GEMINI_API_KEY=...)")
    app.run(debug=True)