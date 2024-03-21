import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./chat";

//  
const socket = io.connect("http://localhost:3001");

function App() {
  //  Created a Socket
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);    //  Shows chat

  //  Function when you join a Room
  const joinRoom = () => {
    // We want to join a room if username is not empty
    if (username !== "" && room !== "")  {
      socket.emit("join_room", room); //  this is passed in data (in backend)
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      { !showChat ? (     //  If showChat == false, then just show chat
      <div className="joinChatContainer">
      <h3>Chit-Chat 🗣️</h3>
      <input type="text" placeholder="Username" 
          onChange={(event) => {
            setUsername(event.target.value);  //target.value == gets the input
            }}/>  
      <input type="text" placeholder="Room ID"
      onChange={(event) => {
        setRoom(event.target.value);  
        }}/>

      <button onClick={joinRoom}>Join</button>
      </div>
      )
    : (
      <Chat socket={socket} username={username} room={room}/>
    )}
    </div>
  );
}

export default App;
