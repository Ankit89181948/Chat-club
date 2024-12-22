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
    const newSocket = io("http://localhost:9000"); // Connect to your server
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

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
    const isValid = validation();
    if (isValid) {
      if (mode === "create") {
        // Emit createRoom event to the server
        socket.emit("createRoom", { roomName: data.name, userName: data.name });

        // Listen for the roomCreated event from the server
        socket.on("roomCreated", ({ roomId, roomName }) => {
          
          navigate(`/chat/${roomId}`, { state: { ...data, room: roomId } });
        });
      } else {
      
        navigate(`/chat/${data.room}`, { state: { ...data, room: data.room } });
      }
    }
    
  };

  return (

    <div className="main-form-container  px-4 py-5 shadow  border rounded row " style={{backgroundColor:"#393e46"}}>

      <form onSubmit={handleSubmit}>

        <div className="form-group mb-4">

          <h2 className="mb-4">Welcome to Chatclub</h2>

        </div>

        {/* Toggle between Create Room and Join Room */}

        <div className="form-group mb-4">

          <label className="form-label me-3">
            <input type="radio" value="create" checked={mode === "create"} onChange={() => setMode("create")} className="me-1" /> Create Room
          </label>

          <label className="form-label">
            <input type="radio" value="join" checked={mode === "join"} onChange={() => setMode("join")} className="me-1" /> Join Room
          </label>

        </div>

        {/* Name Field */}
        <div className="form-group mb-4">
          <input type="text" className="form-control bg-light" name="name" placeholder="Enter name" onChange={handleChange} />
        </div>

        {/* Room ID Field (only for Join Mode) */}
        {
          mode === "join" && (
            <div className="form-group mb-4">
              <input type="text" className="form-control bg-light" name="room" placeholder="Enter room ID" onChange={handleChange} />
            </div>
          )
        }

        

        <button type="submit" className="btn btn-warning w-100 mb-2" style={{backgroundColor:"#f96d00"}}>
          {mode === "create" ? "Create Room" : "Join Room"}
        </button>

        {error && <small className="text-danger m-auto">{error}</small>}

      </form>
    </div>
  );
};

export default MainForm;
