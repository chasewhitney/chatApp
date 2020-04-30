import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import ChatroomList from "./ChatroomList";
import Chatroom from "./Chatroom";


const App = props => {
  const [ username, setUsername ] = useState(null);
  const [ isEditingUsername, setIsEditing ] = useState(false);
  const [ chatroomName, setChatroomName] = useState('');
  // const [ usernameInHeader, setUsernameInHeader] = useState(false);
  const usernameEditRef = useRef();

  const { client } = props;

  useEffect(() => {
    console.log("APP MOUNT");
    client.registerUser(handleUsernameResponse);
  },[])

  const handleRoomChangeResponse = res => {
    if(res && res.error) {
      console.log('Something went wrong on the server setting chatroom..');
      alert(res.error);
    }
    if(res && res.message) {
      console.log("Couldn't update room:", res.message);
      alert(res.message)
    } else {
      console.log('Room set to:', res);
      setChatroomName(res);
    }

  }

  const handleLeave = e => {
    e.preventDefault();
    if(chatroomName) {
      client.leaveRoom(handleRoomChangeResponse);
    }
  }

  const handleJoinRoom = room => {
    if(room.toLowerCase() === chatroomName.toLowerCase()){
      alert("You are already in that room.");
    }
    client.joinRoom(room, handleRoomChangeResponse);
  }

  const handleCreateRoom = room => {
    if(chatroomName && room.toLowerCase() === chatroomName.toLowerCase()){
      alert("You are already in that room.");
    }
    client.createRoom(room, handleRoomChangeResponse);
  }

  const tryUsernameChange = e => {
    e.preventDefault();
    const newName = usernameEditRef.current.value;

    if(newName !== username){
      client.changeUsername(newName, handleUsernameResponse);
    }

    setIsEditing(false);
  }

  const handleUsernameResponse = res => {
    if(res.error) {
      console.log('Something went wrong on the server setting username');
      alert(res.error);
    }
    if(res.message) {
      console.log("Couldn't update username:", res.message);
      alert(res.message)
    } else {
      console.log('Username set to:', res);
      setUsername(res);
    }
  }

  const handleCancelClick = e => {
    e.preventDefault();
    setIsEditing(false);
  }

  const renderUsernameContent = () => {
    if(isEditingUsername) {
      return (
        <>
          <form className="header-username-form">
            <input className="header-username-input" ref={usernameEditRef} defaultValue={username}/>
            <button type="submit" className="header-username-ok" onClick={tryUsernameChange}>OK</button>
            <button className="header-username-cancel" onClick={handleCancelClick}>Cancel</button>
          </form>
        </>
      )
    } else {
      return <div onClick={() => setIsEditing(true)} className="header-username-name">{username}</div>
    }
  }

  const myTestFunc = () => {
    client.checkVars();
  }

  return (
    <div className="App-container">
      <div className="header-container">
        <div className="header-title">          
          <span>CHAT APP</span>
        </div>

        <div className="header-username-container">{renderUsernameContent()}</div>
      </div>
      <div className="main">
        <ChatroomList client={client} joinRoom={handleJoinRoom} createRoom={handleCreateRoom} currentRoom={chatroomName}/>
        <Chatroom client={client} username={username} chatroomName={chatroomName} handleLeaveClick={handleLeave}/>

        { chatroomName ? null :
          <div className="main-noChatroom">
            <div className="main-noChatroom-username">Click your username in the upper right to change it</div>
            <div className="main-noChatroom-rooms">Create or join a room on the left</div>
          </div>
        }
      </div>
      <div className="footer">IMA FOOTER</div>
    </div>
  );
};

export default App;
