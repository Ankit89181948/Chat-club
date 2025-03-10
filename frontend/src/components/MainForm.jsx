import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const MainForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [mode, setMode] = useState("create"); // Default mode: Create Room
  const [data, setData] = useState({ name: "", room: "" });
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://chat-club-98v0.onrender.com"); // Connect to your server
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Validation logic 
  const validation = () => {
    if (!data.name) {
      setError("Please enter your name.");
      return false;
    }
    if (mode === "join" && !data.room) {
      setError("Please enter the room ID to join.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation()) {
      if (mode === "create") {
        socket.emit("createRoom", { roomName: data.name, userName: data.name });
        socket.on("roomCreated", ({ roomId }) => {
          navigate(`/chat/${roomId}`, { state: { ...data, room: roomId } });
        });
      } else {
        navigate(`/chat/${data.room}`, { state: { ...data, room: data.room } });
      }
    }
  };

  return (
    <div className="flex justify-center w-100 items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-center text-2xl font-bold mb-4">Welcome to ChatClub</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" value="create" checked={mode === "create"} onChange={() => setMode("create")} className="accent-orange-500" />
              Create Room
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="join" checked={mode === "join"} onChange={() => setMode("join")} className="accent-orange-500" />
              Join Room
            </label>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={handleChange}
          />
          {mode === "join" && (
            <input
              type="text"
              name="room"
              placeholder="Enter room ID"
              className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleChange}
            />
          )}
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold transition"
          >
            {mode === "create" ? "Create Room" : "Join Room"}
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default MainForm;