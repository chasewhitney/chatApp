import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatLog, setChatLog] = useState([]);
  const chatInputRef = useRef();
  const {client, chatroomName} = props;

  //DEV
  // const devLog = [{user:"STARTER", content:"TOPMOST ITEM"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:"BOTTOM", content:"BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM "}];

  const addEntry = message => {
    console.log('got a message:', message);
    setChatLog((prevLog) => prevLog.concat(message));
  }

  useEffect(() => {
    client.listenForMessages(addEntry);
  }, []);

  const handleChatSubmit = e => {
    e.preventDefault();
    const message = chatInputRef.current.value;
    console.log(message);
    client.sendMessage(message, handleChatResponse);
    chatInputRef.current.value = '';
  }

  const handleChatResponse = res => {
    console.log('handleChatResponse:', res);
    if(res) {
      addEntry(res);
    }
  }

  const renderChatLog = () => {
    // console.log('RENDERING CHATLOG with:', chatLog);

    let keyCounter = 1;

    return (
      <>{ chatLog.map( message => {
        if(message.username) return <div key={keyCounter++} className="chat-item"><span className="chat-item-sender">{ message.username }:</span><span className="chat-item-content">{ message.content }</span></div>
        else return <div className="chat-serverMessage" key={keyCounter++}>{ message.content }</div>
        })}
      </>
    )
  }

  // console.log("Rending ChatWindow");
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
