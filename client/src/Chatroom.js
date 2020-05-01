import React, {useEffect} from "react";

import ChatWindow from "./ChatWindow";
import UserList from "./UserList";

export default props => {
  const {client, chatroomName, handleLeaveClick, username} = props;

  useEffect(()=>{
    console.log('Chatroom Component rendered');
  })

  if(chatroomName) {
    return (
      <div className="chatroom">
        <div className="chatroom__chatWindow">
          <div className="chatWindow__header">
            <div className="chatWindow__header-name">{chatroomName}</div>
            <div className="chatWindow__header-leave" onClick={handleLeaveClick}><span>X</span></div>
          </div>
          <ChatWindow client={client} chatroomName={chatroomName} username={username}/>
        </div>
        <UserList client={client} chatroomName={chatroomName}/>
      </div>
    )
  }

  return null;
}
