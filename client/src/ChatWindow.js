import React, {useState, useEffect} from "react";

export default props => {
  const [chatLog, setChatLog] = useState([]);
  const {client} = props;
  let keyCounter = 1;


  const addEntry = message => {
    setChatLog((prevLog) => prevLog.concat(message));
  }

  useEffect(() => {
    client.listenForMessages(addEntry);
  }, []);

  const renderChatLog = () => {
    console.log('RENDERING CHATLOG with:', chatLog);
    return <div>{chatLog.map(message => {
      return <div key={keyCounter++}>{message}</div>
    })}</div>
  }

  console.log("Rending ChatWindow");
  return <div className="chatWindow-chatLog">{renderChatLog()}</div>
}
