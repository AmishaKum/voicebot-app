const micBtn = document.getElementById("micBtn");
const userText = document.getElementById("userText");
const botText = document.getElementById("botText");

let listening = false;
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

micBtn.onclick = () => {
  if (!listening) {
    listening = true;
    botText.textContent = "...";
    userText.textContent = "Listening...";
    recognition.start();
    micBtn.textContent = "🎙️ Listening...";
  }
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  userText.textContent = transcript;
  micBtn.textContent = "🎤 Start Speaking";
  listening = false;

  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: transcript }),
  });

  const data = await r.json();
  botText.textContent = data.text;

  const audio = new Audio("data:audio/wav;base64," + data.audio);
  audio.play();
};
