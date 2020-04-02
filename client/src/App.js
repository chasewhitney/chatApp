import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const endpoint = "http://localhost:5001";
const socket = io(endpoint);

const App = () => {
  const [userName, setUserName] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!userName) {
      console.log("Getting name from server");
      socket.emit("getUserName", data => {
        console.log("got:", data);
      });
    }
  });

  return (
    <div className="App-container">
      <div className="header">
        <div className="header-title">CHAT APP</div>
        <div className="header-userName">GUEST1234</div>
      </div>
      <div className="main">
        <div className="chatRoomList-container">
          <div className="chatRoomList-content">Rooms</div>
        </div>
        <div className="chatWindow-container">
          <div className="chatWindow-content">Chat Content</div>
        </div>
        <div className="userList-container">
          <div className="userList-content">Users</div>
        </div>
      </div>
      <div className="footer">IMA FOOTER</div>
    </div>
  );
};

export default App;
