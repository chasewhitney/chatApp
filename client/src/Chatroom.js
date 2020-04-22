import React from "react";

import ChatWindow from "./ChatWindow";

export default props => {
  console.log('RENDER CHATROOM');
  const {client} = props;

  const testFunc = () => {
    client.sendMessage("Test");
  }


  return (
    <div className="chatroom-container">
      <div className="chatWindow-container">
        <div className="chatWindow-name">
          CHATROOM NAME
          <button onClick={testFunc}>TEST</button>
        </div>
        <ChatWindow client={client}/>
        <div className="chatWindow-inputBar">IMA INPUT BAR</div>
      </div>
      <div className="userList-container">
        <div className="userList-content">Users</div>
      </div>
    </div>
  )
}
