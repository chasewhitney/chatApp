import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatroomList, setChatroomList] = useState([]);
  const chatroomCreateRef = useRef();
  let chatroomToJoin = '';

  const {client, joinRoom, createRoom} = props;

  useEffect(() => {
    client.getRooms(handleGetResponse);
    client.listenForChatrooms(handleListUpdate);
    //DEV
    // setChatroomList(["RoomOne", "Two", "Three","RoomOne", "Two", "Three","RoomOne", "Two", "Three","RoomOne", "Two", "Three","RoomOne", "Two", "Three","RoomOne", "Two", "Three"]);
  }, []);


  const handleGetResponse = res => {
    console.log('getChatroomsResponse:', res);
    setChatroomList(res);
  }
  const handleListUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const handleListClick = (e, chatroomName) => {
    e.preventDefault();
    joinRoom(chatroomName);
  }

  const handleCreateSubmit = e => {
    e.preventDefault();
    const roomName = chatroomCreateRef.current.value;
    // console.log('creating:', roomName);
    createRoom(roomName);
    chatroomCreateRef.current.value = "";
  }

  const testFunc = () => {
    console.log('in testFunc');
  }

  const renderChatrooms = () => {
    if(chatroomList.length > 0)
    {
      return <div className="chatroomList-itemsContainer">{chatroomList.map(chatroomName => <div onClick={(e) => handleListClick(e, chatroomName)} key={chatroomName} className="chatroomList-item">{chatroomName}</div>)}</div>
    } else {
      return <div className="chatroomList-noItems">No chatrooms available</div>
    }
  }

  // console.log('rendering ChatroomList');
  return (
          <div className="chatroomList-container">
            <div className="chatroomList-header">Chatrooms</div>
            <div className="chatroomList-content">{renderChatrooms()}</div>
            <div className="chatroomList-inputs">
              <div>( Click to join )</div>
              <div>Or</div>
              <form className="chatList-form"><input className="chatroomList-textInput" type="text" ref={chatroomCreateRef}/ ><button className="chatroomList-submit" onClick={handleCreateSubmit}>CREATE</button></form>
            </div>
          </div>
  )
}
