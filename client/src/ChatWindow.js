import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatLog, setChatLog] = useState([]);
  const chatInputRef = useRef();
  const {client, chatroomName} = props;


  const addEntry = message => {
    setChatLog((prevLog) => prevLog.concat(message));
  }

  useEffect(() => {
    client.listenForMessages(addEntry);
  }, []);

  const handleChatSubmit = e => {
    e.preventDefault();
    const message = chatInputRef.current.value;
    console.log(message);
    client.sendMessage(message, chatroomName, handleChatResponse);
  }

  const handleChatResponse = res => {
    console.log('handleChatResponse:', res);
    if(res) {
      addEntry(res);
    }
  }

  const renderChatLog = () => {
    console.log('RENDERING CHATLOG with:', chatLog);

    let keyCounter = 1;

    return <div>{ chatLog.map( message => <div key={keyCounter++}>{ message.user }: { message.content }</div> )}</div>
  }

  console.log("Rending ChatWindow");
  return (
    <>
      <div className="chatWindow-chatLog">
        {renderChatLog()}
      </div>
      <form>
        <input className="chatWindow-inputBar" type="text" ref={chatInputRef} /><button type="submit" onClick={handleChatSubmit}>Send</button>
      </form>
    </>
  )
}
