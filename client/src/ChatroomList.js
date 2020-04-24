import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatroomList, setChatroomList] = useState([]);
  const chatroomCreateRef = useRef();
  let chatroomToJoin = '';

  const {client} = props;

  useEffect(() => {
    client.getChatrooms(setChatroomList);
    client.listenForChatrooms(onChatroomUpdate);
  }, []);

  const onChatroomUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const handleListClick = (e,chatroomName) => {
    e.preventDefault();
    chatroomToJoin = chatroomName;
  }

  const handleJoinClick = e => {
    e.preventDefault();
    if(chatroomToJoin) {
      client.joinChatroom(chatroomToJoin, handleJoinResponse);
      chatroomToJoin = '';
    }
  }

  const handleJoinResponse = res => {
    if(res) {
      console.log('handleJoinResponse:', res);
      props.setChatroomName(res);
    } else {
      console.log('handleJoinResponse: failure');
      // Do stuff
    }
  }

  const handleCreateSubmit = e => {
    e.preventDefault();
    const roomName = chatroomCreateRef.current.value;
    console.log('submitting:', roomName);
    client.createChatroom(roomName, handleCreateResponse);
    chatroomCreateRef.current.value = "";
  }

  const handleCreateResponse = res => {
    if(res) {
      console.log('handleCreateResponse:', res);
      // Do stuff
    } else {
      console.log('handleCreateResponse: failure');
      // Do stuff
    }
  }

  const testFunc = () => {
    console.log('in testFunc');
  }

  const renderChatrooms = () => {
    if(chatroomList)
    {
      return <>{chatroomList.map(chatroomName => <div onClick={(e) => handleListClick(e, chatroomName)} key={chatroomName} className="chatroomList-item">{chatroomName}</div>)}</>
    } else {
      return <div>No chatrooms available</div>
    }
  }

  return (
          <div className="chatroomList-container">
            <div className="chatroomList-header">Chatrooms</div>
            <button onClick={testFunc}>TEST</button>
            <div className="chatroomList-content">{renderChatrooms()}</div>
            <div className="chatroomList-inputs">
              <button onClick={handleJoinClick}>JOIN</button>
              <form><input type="text" ref={chatroomCreateRef}/ ><button onClick={handleCreateSubmit}>CREATE</button></form>
            </div>
          </div>
  )
}
