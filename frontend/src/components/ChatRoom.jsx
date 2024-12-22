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
    // Initialize socket connection
    const newSocket = io("http://localhost:9000");
    setSocket(newSocket);

    // Join the room when socket connects
    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("joinRoom", location.state.room);
    });

    // Listen for new messages
    newSocket.on("getLatestMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
    });

    // Cleanup socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [location.state.room]);

  useEffect(() => {
    setData(location.state);
  }, [location]);

  const handleChange = (e) => setMsg(e.target.value);

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
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
    <div className="py-4 m-5 w-50 shadow bg-gray text-dark border rounded container" style={{backgroundColor:"#393e46"}}>
      <div className="text-center px-3 mb-4 text-capitalize bg-white border rounded flex justify-center" style={{backgroundColor:"#f2f2f2"}}>
        <h2 className=" mb-4">Room-Id: {data?.room}</h2>
      </div>
      <div
        className="border rounded p-3 mb-4"
        style={{ height: "450px", overflowY: "scroll" }}
      >
        {allMessages.map((message, index) => (
          <div
            key={index}
            className={
              data.name === message.name
                ? "row justify-content-end pl-5"
                : "row justify-content-start"
            }
          >
            <div
              className={`d-flex flex-column m-2  p-2 border rounded w-auto ${
                data.name === message.name ? "bg-white align-items-end" : "bg-white"
              }`}
            >
              <div>
                <strong className="m-1 justify-content-start">{message.name}</strong>
              </div>
              <h4 className="m-1">{message.msg}</h4>
            </div>
          </div>
        ))}
       
      </div>
      <div className="form-group d-flex">
        <input
          type="text"
          className="form-control bg-light"
          name="message"
          onKeyDown={handleEnter}
          placeholder="Type your message"
          value={msg}
          onChange={handleChange}
        />
        <button
          type="button"
          className="btn  mx-2"
          onClick={onSubmit}
          style={{backgroundColor:"#f96d00"}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
