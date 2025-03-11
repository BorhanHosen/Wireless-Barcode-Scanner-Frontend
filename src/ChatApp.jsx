import { useEffect, useState } from "react";
import { socket } from "./socket";

function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("h", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-xl font-bold mb-4">Chat App</h1>
        <div className="h-60 overflow-y-auto border p-2 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-1 border-b">
              {msg}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
