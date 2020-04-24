import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatroomList, setChatroomList] = useState([]);
  const chatroomCreateRef = useRef();
  let chatroomToJoin = '';

  const {client, joinChatroom} = props;

  useEffect(() => {
    client.getChatrooms(setChatroomList);
    client.listenForChatrooms(onChatroomUpdate);
  }, []);

  const onChatroomUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const handleListClick = (e, chatroomName) => {
    e.preventDefault();
    chatroomToJoin = chatroomName;
  }

  const handleJoinClick = e => {
    e.preventDefault();
    if(chatroomToJoin) {
      joinChatroom(chatroomToJoin);
      chatroomToJoin = '';
    }
  }

  const handleCreateSubmit = e => {
    e.preventDefault();
    const roomName = chatroomCreateRef.current.value;
    console.log('creating:', roomName);
    joinChatroom(roomName);
    chatroomCreateRef.current.value = "";
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

  console.log('rendering ChatroomList');
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
