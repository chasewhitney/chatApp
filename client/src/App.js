import React, { useState, useEffect, useRef } from "react";
import ChatroomList from "./ChatroomList";
import Chatroom from "./Chatroom";
import "./App.css";

const App = props => {
  const [ username, setUsername ] = useState(null);
  const [ isEditingUsername, setIsEditing ] = useState(false);
  const [ chatroomName, setChatroomName] = useState(null);
  const usernameEditRef = useRef();

  const { client } = props;

  useEffect(() => {
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
    if(chatroomName && room && room.toLowerCase() === chatroomName.toLowerCase()){
      alert("Cannot join that room.");
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

    if(newName.length > 22){
      return alert("Maximum name length is 22 characters");
    }

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
          <form className="header__username__form">
            <input className="header__username__input" ref={usernameEditRef} defaultValue={username}/>
            <button type="submit" className="header__username__ok" onClick={tryUsernameChange}>OK</button>
            <button className="header__username__cancel" onClick={handleCancelClick}>Cancel</button>
          </form>
        </>
      )
    } else {
      return <div onClick={() => setIsEditing(true)} className="header__username__name">{username}</div>
    }
  }

  return (
    <div className="App__container">
      <div className="header__container">
        <div className="header__title">
          <span>CHAT APP</span>
        </div>
        <div className="header__username__container">{renderUsernameContent()}</div>
      </div>
      <div className="main">
        <ChatroomList client={client} joinRoom={handleJoinRoom} createRoom={handleCreateRoom} currentRoom={chatroomName}/>
        <Chatroom client={client} username={username} chatroomName={chatroomName} handleLeaveClick={handleLeave}/>
        { chatroomName ? null :
          <div className="main__noChatroom">
            <div className="main__noChatroom__username">Click your username in the upper right to change it</div>
            <div className="main__noChatroom__rooms">Create or join a room on the left</div>
          </div>
        }
      </div>
      <div className="footer">© 2020 Chase Whitney. All Rights Reserved.</div>
    </div>
  );
};

export default App;
