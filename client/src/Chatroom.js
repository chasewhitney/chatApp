import React from "react";

import ChatWindow from "./ChatWindow";
import UserList from "./UserList";

export default props => {
  const {client, chatroomName} = props;

  if(chatroomName) {
    return (
      <div className="chatroom-container">
        <div className="chatWindow-container">
          <div className="chatWindow-name">
            {chatroomName}
          </div>
          <ChatWindow client={client} chatroomName={chatroomName}/>
        </div>
        <UserList client={client} chatroomName={chatroomName}/>
      </div>
    )
  }

  return null;
}
