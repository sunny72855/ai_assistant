// =========================================================
//  DPKS AI — Frontend (Stable Build v2.2)
//  Includes Patch Notes modal, improved typing, and UX fixes
// =========================================================

console.log("✅ DPKS AI frontend loaded");

// -------------------- DOM References --------------------
const chatEl = document.querySelector("#chat");
const sendBtn = document.getElementById("sendBtn");
const stopBtn = document.getElementById("stopBtn");
const promptInput = document.getElementById("prompt");
const clearBtn = document.getElementById("clearBtn");
const themeToggleBtn = document.getElementById("themeToggle");
const categorySelect = document.getElementById("category");
const styleSelect = document.getElementById("style");
const languageSelect = document.getElementById("language");
const homeSection = document.getElementById("home");
const chatSection = document.getElementById("chat-screen");
const startChatBtn = document.getElementById("startChatBtn");
const homeBtn = document.getElementById("homeBtn");
const promptForm = document.getElementById("promptForm");
const patchBtn = document.getElementById("patchBtn");
const patchModal = document.getElementById("patchModal");
const closePatch = document.getElementById("closePatch");

// -------------------- Global State --------------------
let isGenerating = false;
let typingTimeout;

// -------------------- Helpers --------------------
function scrollToBottom(smooth = true) {
    const anchor = document.getElementById("bottom-anchor");
    if (anchor) {
        anchor.scrollIntoView({
            behavior: smooth ? "smooth" : "instant",
            block: "end",
        });
    }
}

function appendBubble(role, text = "", isTyping = false) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble", role);

    if (isTyping) {
        bubble.classList.add("typing");
        bubble.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    `;
    } else {
        if (role === "assistant" && typeof marked !== "undefined") {
            bubble.innerHTML = marked.parse(text || "");
        } else {
            bubble.textContent = text || "";
        }
    }

    chatEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
}

function clearChat() {
    chatEl.innerHTML = "";
    fetch("/clear", { method: "POST" }).catch(() => { });
    appendBubble("assistant", "🧹 Chat cleared!");
}

// -------------------- Generate Message --------------------
async function generateMessage() {
    const prompt = promptInput.value.trim();
    if (!prompt || isGenerating) return;

    console.log("🟦 Sending prompt:", prompt);

    // Lock UI state
    sendBtn.disabled = true;
    stopBtn.disabled = false;
    promptInput.disabled = true;
    isGenerating = true;

    // Add user message
    appendBubble("user", prompt);
    promptInput.value = "";

    // Add typing indicator
    const typingBubble = appendBubble("assistant", "", true);
    console.log("💬 Typing bubble created");

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt,
                category: categorySelect.value,
                style: styleSelect.value,
                language: languageSelect.value,
            }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log("🟩 Server response:", data);

        typingBubble.remove();

        if (!isGenerating) return;

        if (data.ok && data.assistant) {
            typeText(data.assistant);
        } else if (data.assistant) {
            appendBubble("assistant", data.assistant);
        } else {
            appendBubble(
                "assistant",
                "⚠️ There was an issue generating a response."
            );
        }
    } catch (err) {
        console.error("❌ Fetch error:", err);
        typingBubble.remove();
        appendBubble(
            "assistant",
            "🚧 The AI servers are busy. Please try again soon!"
        );
    } finally {
        stopBtn.disabled = true;
        sendBtn.disabled = false;
        promptInput.disabled = false;
    }
}

// -------------------- Stop Generation --------------------
async function stopGeneration() {
    if (!isGenerating) return;
    console.log("🛑 Generation stopped manually");
    isGenerating = false;

    stopBtn.disabled = true;
    sendBtn.disabled = false;
    promptInput.disabled = false;

    try {
        await fetch("/api/stop", { method: "POST" });
    } catch (e) {
        console.warn("Stop request failed:", e);
    }

    clearTimeout(typingTimeout);
    const typingBubble = document.querySelector(".bubble.assistant.typing");
    if (typingBubble) typingBubble.remove();
    appendBubble("assistant", "⏹ Generation stopped.");
}

// -------------------- Typewriter Animation --------------------
function typeText(text) {
    const bubble = appendBubble("assistant", "");
    let index = 0;
    const speed = 15; // ms per character
    isGenerating = true;

    function type() {
        if (index < text.length && isGenerating) {
            bubble.textContent += text.charAt(index++);
            chatEl.scrollTop = chatEl.scrollHeight;
            typingTimeout = setTimeout(type, speed);
        } else {
            isGenerating = false;
            stopBtn.disabled = true;
            sendBtn.disabled = false;
            promptInput.disabled = false;
        }
    }

    type();
}

// -------------------- Dark Mode --------------------
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark", !!enabled);
    localStorage.setItem("theme", enabled ? "dark" : "light");
}

function initDarkMode() {
    const stored = localStorage.getItem("theme");
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyDarkMode(stored ? stored === "dark" : prefersDark);
}

// -------------------- Patch Notes Modal --------------------
if (patchBtn && patchModal && closePatch) {
    patchBtn.addEventListener("click", () =>
        patchModal.classList.remove("hidden")
    );
    closePatch.addEventListener("click", () =>
        patchModal.classList.add("hidden")
    );
    patchModal.addEventListener("click", (e) => {
        if (e.target === patchModal) patchModal.classList.add("hidden");
    });
}

// -------------------- Navigation --------------------
function showChatScreen() {
    homeSection.classList.add("hidden");
    chatSection.classList.remove("hidden");
    scrollToBottom();
}

function showHomeScreen() {
    chatSection.classList.add("hidden");
    homeSection.classList.remove("hidden");
}

// -------------------- Event Wiring --------------------
promptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    generateMessage();
});

sendBtn.addEventListener("click", generateMessage);
stopBtn.addEventListener("click", stopGeneration);
clearBtn.addEventListener("click", clearChat);
themeToggleBtn.addEventListener("click", () =>
    applyDarkMode(!document.body.classList.contains("dark"))
);
startChatBtn.addEventListener("click", showChatScreen);
homeBtn.addEventListener("click", showHomeScreen);

promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
        e.preventDefault();
        generateMessage();
    }
});

// -------------------- Init --------------------
initDarkMode();
scrollToBottom();
console.log("🚀 DPKS AI Frontend initialized successfully");
