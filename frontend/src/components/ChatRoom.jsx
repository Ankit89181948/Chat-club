import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const ChatRoom = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://chat-club-98v0.onrender.com");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", location.state.room);
    });

    newSocket.on("getLatestMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [location.state.room]);

  useEffect(() => {
    setData(location.state);
  }, [location]);

  const handleChange = (e) => setMsg(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = () => {
    if (msg && socket) {
      const newMessage = { time: new Date(), msg, name: data.name };
      socket.emit("newMessage", { newMessage, room: data.room });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMsg("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      {/* Room Header */}
      <div className="bg-gray-800 p-4 rounded-lg text-center shadow-md">
        <h2 className="text-xl font-semibold">Room ID: {data?.room}</h2>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 mt-4 space-y-4 bg-gray-700 rounded-lg shadow-md">
        {allMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${data.name === message.name ? "justify-end" : "justify-start"}`}
          >
            <div className={`p-3 max-w-xs rounded-lg shadow-lg ${data.name === message.name ? "bg-blue-500 text-white" : "bg-gray-600"}`}>
              <p className="text-sm font-semibold">{message.name}</p>
              <p>{message.msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex mt-4 items-center gap-2">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={msg}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
        <button
          className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg"
          onClick={onSubmit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;