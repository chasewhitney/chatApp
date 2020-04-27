import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import ChatroomList from "./ChatroomList";
import Chatroom from "./Chatroom";


const App = props => {
  const [ username, setUsername ] = useState( "GUEST-" + Math.ceil( Math.random() * 999999 ) );
  const [ isEditingUsername, setIsEditing ] = useState(false);
  const [ chatroomName, setChatroomName] = useState('');
  // const [ usernameInHeader, setUsernameInHeader] = useState(false);
  const usernameEditRef = useRef();

  const { client } = props;

  useEffect(() => {
    console.log("APP MOUNT");
    // console.log('username:', username);
    client.setUsername(username, null, chatroomName, changeUsername);
    // client.listenForChatroomName(handleChatroomChange);

    // //DEV MOUNT
    // setChatroomName("DEV-ROOM");

  },[])

  const handleLeaveClick = e => {
    e.preventDefault();
    client.setChatroom(chatroomName, null, handleSetChatroomResponse);
  }

  const handleChatroomChange = newChatroomName => {
    // console.log(`Changing rooms from ${chatroomName} to ${newChatroomName}`);
    client.setChatroom(chatroomName, newChatroomName, handleSetChatroomResponse);
    // setUsernameInHeader(true);
  }

  const handleSetChatroomResponse = res => {
    // console.log('setting chatroom to:', res);
    setChatroomName(res);
  }

  // DEV
  const myTestFunc = () => {
    client.checkVars();
  }
  // END DEV

  const tryUsernameChange = e => {
    e.preventDefault();
    const newName = usernameEditRef.current.value;

    if(newName === username){
      // console.log('name unchanged');
      setIsEditing(false);
    }

    client.setUsername(newName, username, chatroomName, changeUsername);
  }

  const changeUsername = name => {
    if(name) {
      setUsername(name);
      setIsEditing(false);
    }
    else {
      alert("Username in use. Try a different username.");
      // console.log('NAME CHANGE FAILED');
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

  return (
    <div className="App-container">
      <div className="header-container">
        <div className="header-title"><span>CHAT APP</span></div>
        <div className="header-chatroomName">
          {chatroomName}<button onClick={handleLeaveClick}>Leave</button>
        </div>
        {!chatroomName ? null : <div className="header-username-container">{renderUsernameContent()}</div>}
      </div>
      <div className="main">
        <ChatroomList client={client} joinChatroom={handleChatroomChange}/>
        <Chatroom client={client} chatroomName={chatroomName} leaveChatroom={handleChatroomChange}/>
        {chatroomName ? null : <div className="main-noChatroom"><div className="main-noChatroom-hello">Hello,</div>{renderUsernameContent()}<div className="main-noChatroom-click">Click to change</div></div>}
      </div>
      <div className="footer">IMA FOOTER</div>
    </div>
  );
};

export default App;
