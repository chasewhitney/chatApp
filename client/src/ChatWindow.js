import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [usernameSet, setUsernameSet] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const chatInputRef = useRef();
  let messagesEnd = useRef();

  const {client, chatroomName, username} = props;

  useEffect(() => {
    addEntry({username:null, content:`You joined ${chatroomName}.`});
    client.listenForMessages(addEntry);
    setUsernameSet(true);

    return () => client.stopListeningMessages();
  }, []);

  useEffect(() =>{
    if(usernameSet) {
      addEntry({username: null, content: `Changed name to ${username}.`});
    }
  }, [username]);

  useEffect(() => {
    setChatLog([]);
    addEntry({username:null, content:`You joined ${chatroomName}.`});
  },[chatroomName]);

  useEffect(() => {
    scrollToBottom();
  })

  const addEntry = message => {
    setChatLog((prevLog) => prevLog.concat(message));
  }

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  const handleChatSubmit = e => {
    e.preventDefault();
    const message = chatInputRef.current.value;
    if(message.length < 1) {
      return;
    }
    console.log(message);
    client.sendMessage(message, handleChatResponse);
    chatInputRef.current.value = '';
  }

  const handleChatResponse = res => {
    if(res) {
      addEntry(res);
    }
  }

  const renderChatLog = () => {
    let keyCounter = 1;

    return (
      <>{ chatLog.map( message => {
          if(message.username) return <div key={keyCounter++} className="chatLog__message"><span className="chatLog__message-sender">{ message.username }:</span><span className="chatLog__message-content">{ message.content }</span></div>
          else return <div className="chatLog__serverMessage" key={keyCounter++}>{ message.content }</div>
        })}
      </>
    )
  }

  return (
    <>
      <div className="chatWindow__chatLog">
        {renderChatLog()}
        <div ref={el => messagesEnd = el} />
      </div>
      <form>
        <input className="chatWindow__inputBar" type="text" ref={chatInputRef} /><button hidden={true} type="submit" onClick={handleChatSubmit}>Send</button>
      </form>
    </>
  )
}
