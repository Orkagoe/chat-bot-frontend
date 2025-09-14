import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }), // <-- исправил
      });

      if (!res.ok) {
        throw new Error("Ошибка при получении ответа от сервера");
      }

      const text = await res.text();
      setMessages(prev => [
        ...prev,
        { role: "user", content: input },
        { role: "bot", content: text }
      ]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "Ошибка: сервер недоступен" }
      ]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>OpenRouter Chat</h1>
      <div style={{ marginBottom: 20 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.content}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Напиши сообщение..."
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
}

export default App;
