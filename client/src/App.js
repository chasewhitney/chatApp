import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import ChatroomList from "./ChatroomList";
import Chatroom from "./Chatroom";

const App = props => {
  const [ username, setUsername ] = useState( "GUEST-" + Math.ceil( Math.random() * 999999 ) );
  const [ isEditingUsername, setIsEditing ] = useState(false);
  const [ chatroomName, setChatroomName] = useState('');
  const usernameEditRef = useRef();

  const { client } = props;

  useEffect(() => {
    console.log('username:', username);
    client.setUsername(username, changeUsername);
    // client.listenForChatroomName(handleSetChatroomName);
  },[])

  const handleChatroomChange = newChatroomName => {
    console.log(`Changing rooms from ${chatroomName} to ${newChatroomName}`);
    client.setChatroom(chatroomName, newChatroomName, handleSetChatroomResponse);
  }

  const handleSetChatroomResponse = res => {
    console.log('setting chatroom to:', res);
    setChatroomName(res);
  }

  // DEV
  const myTestFunc = () => {
    client.checkVars();
  }
  // END DEV

  const tryUsernameChange = e => {
    e.preventDefault();
    const name = usernameEditRef.current.value;

    if(name === username){
      console.log('name unchanged');
      setIsEditing(false);
    }

    client.setUsername(name, changeUsername);
  }

  const changeUsername = name => {
    if(name) {
      setUsername(name);
      setIsEditing(false);
    }
    else {
      alert("Username in use. Try a different username.");
      console.log('NAME CHANGE FAILED');
    }
  }

  const handleCancelClick = e => {
    e.preventDefault();
    setIsEditing(false);
  }

  const renderUsernameContent = () => {
    if(isEditingUsername) {
      return <div><form><input ref={usernameEditRef} defaultValue={username}/><button type="submit" onClick={tryUsernameChange}>OK</button><button onClick={handleCancelClick}>Cancel</button></form></div>
    } else {
      return <div>Username: {username} <button onClick={() => setIsEditing(true)}>CHANGE</button></div>
    }
  }

  return (
    <div className="App-container">
      <div className="header">
        <div className="header-title">CHAT APP</div>
        <button onClick={myTestFunc}>TEST</button>
        <div className="header-userName">{renderUsernameContent()}
        </div>
      </div>
      <div className="main">
        <ChatroomList client={client} joinChatroom={handleChatroomChange}/>
        <Chatroom client={client} chatroomName={chatroomName} leaveChatroom={handleChatroomChange}/>
      </div>
      <div className="footer">IMA FOOTER</div>
    </div>
  );
};

export default App;
