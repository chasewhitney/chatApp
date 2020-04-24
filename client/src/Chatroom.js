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
          <ChatWindow client={client}/>
          <div className="chatWindow-inputBar">IMA INPUT BAR</div>
        </div>
        <UserList client={client} />
      </div>
    )
  }

  return <div className="chatroom-container">Select a chatroom to join or create one yourself</div>;
}
