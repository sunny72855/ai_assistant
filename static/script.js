// script.js - handles AJAX submit, loading UI, dark mode and clear
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("promptForm");
    const chat = document.getElementById("chat");
    const promptInput = document.getElementById("prompt");
    const sendBtn = document.getElementById("sendBtn");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const clearBtn = document.getElementById("clearBtn");
    const themeToggle = document.getElementById("themeToggle");
    const bottom = document.getElementById("bottom-anchor");

    // apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.remove("hidden");
            sendBtn.disabled = true;
        } else {
            loadingOverlay.classList.add("hidden");
            sendBtn.disabled = false;
        }
    }

    function scrollToBottom() {
        bottom.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // append bubble helpers
    function appendUserBubble(text) {
        const d = document.createElement("div");
        d.className = "bubble user";
        d.textContent = text;
        chat.insertBefore(d, bottom);
        scrollToBottom();
    }
    function appendAssistantBubble(text) {
        const d = document.createElement("div");
        d.className = "bubble assistant";
        // preserve newlines
        d.textContent = text;
        chat.insertBefore(d, bottom);
        scrollToBottom();
    }

    // handle form send
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prompt = promptInput.value.trim();
        if (!prompt) return;
        const category = document.getElementById("category").value;
        const style = document.getElementById("style").value;
        const language = document.getElementById("language").value;

        // optimistic UI - show user bubble
        appendUserBubble(prompt);
        promptInput.value = "";
        showLoading(true);

        try {
            const resp = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, category, style, language })
            });
            const j = await resp.json();
            showLoading(false);
            if (j.ok) {
                appendAssistantBubble(j.assistant);
            } else {
                appendAssistantBubble("Error: " + (j.error || "Unknown error"));
            }
        } catch (err) {
            showLoading(false);
            appendAssistantBubble("Network error: " + err.message);
        }
    });

    // clear conversation
    clearBtn.addEventListener("click", async () => {
        if (!confirm("Clear conversation?")) return;
        try {
            const r = await fetch("/clear", { method: "POST" });
            const j = await r.json();
            if (j.ok) {
                // remove all bubbles
                document.querySelectorAll(".bubble").forEach(n => n.remove());
            } else {
                alert("Could not clear.");
            }
        } catch (e) {
            alert("Error clearing conversation.");
        }
    });

    // theme toggle
    themeToggle.addEventListener("click", () => {
        const dark = document.body.classList.toggle("dark");
        localStorage.setItem("theme", dark ? "dark" : "light");
    });

    // auto-scroll to bottom on load
    scrollToBottom();
});