import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [usernameSet, setUsernameSet] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const chatInputRef = useRef();
  const {client, chatroomName, username} = props;


  //DEV
  // const devLog = [{user:"STARTER", content:"TOPMOST ITEM"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:"Bot", content:"Ima bot"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:null, content: "This is a server message"},{user:"BOTTOM", content:"BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM BOTTOMMOST ITEM "}];

  const addEntry = message => {
    console.log('got a message:', message);
    setChatLog((prevLog) => prevLog.concat(message));
  }

  useEffect(() => {
    addEntry({username:null, content:`You joined ${chatroomName}`});
    client.listenForMessages(addEntry);
    setUsernameSet(true);

    return () => client.stopListeningMessages();
  }, []);

  useEffect(() =>{
    if(usernameSet) {
      addEntry({username: null, content: `Changed name to ${username}`});
    }
  }, [username]);

  useEffect(() => {
    setChatLog([]);
    addEntry({username:null, content:`You joined ${chatroomName}`});
  },[chatroomName]);

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
        if(message.username) return <div key={keyCounter++} className="chatLog__message"><span className="chatLog__message-sender">{ message.username }:</span><span className="chatLog__message-content">{ message.content }</span></div>
        else return <div className="chatLog__serverMessage" key={keyCounter++}>{ message.content }</div>
        })}
      </>
    )
  }

  // console.log("Rending ChatWindow");
  return (
    <>
      <div className="chatWindow__chatLog">
        {renderChatLog()}
      </div>
      <form>
        <input className="chatWindow__inputBar" type="text" ref={chatInputRef} /><button hidden={true} type="submit" onClick={handleChatSubmit}>Send</button>
      </form>
    </>
  )
}
