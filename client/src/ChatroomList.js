import React, {useState, useEffect, useRef} from "react";

export default props => {
  const [chatroomList, setChatroomList] = useState([]);
  const chatroomCreateRef = useRef();

  let chatroomToJoin = '';
  const {client, joinRoom, createRoom, currentRoom} = props;

  useEffect(() => {
    client.getRooms(handleGetResponse);
    client.listenForChatrooms(handleListUpdate);

    return () => client.stopListeningRooms();
  }, []);

  const handleGetResponse = res => {
    setChatroomList(res);
  }

  const handleListUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const handleListClick = (e, chatroomName) => {
    e.preventDefault();
    if(currentRoom === chatroomName) return null;
    joinRoom(chatroomName);
  }

  const handleCreateSubmit = e => {
    e.preventDefault();
    const roomName = chatroomCreateRef.current.value;
    if(roomName.length > 27) {
      return alert("Maximum name length is 27 characters");
    }
    if(roomName.length < 1 || !roomName.replace(/\s/g, '').length) return;
    // console.log('creating:', roomName);
    createRoom(roomName);
    chatroomCreateRef.current.value = "";
  }

  const renderChatrooms = () => {
    if(chatroomList.length > 0)
    {
      return <div className="chatroomsList__content">{chatroomList.map(chatroomName => <div onClick={(e) => handleListClick(e, chatroomName)} key={chatroomName} className="chatroomsList__item">{chatroomName}</div>)}</div>
    } else {
      return <div className="chatroomsList__noItems">No lobbies found</div>
    }
  }

  return (
          <div className="chatroomsNav">
            <div className="chatroomsNav__chatroomsList">
            <div className="chatroomsList__header">Lobbies</div>
            {renderChatrooms()}
            </div>
            <div className="chatroomsNav__createChatroom">
              <div>(Click to join)</div>
              <div>or</div>
              <form className="createChatroom__form"><input className="createChatroom__textInput" type="text" ref={chatroomCreateRef}/ ><button className="createChatroom__submit" onClick={handleCreateSubmit}><span>Create</span></button></form>
            </div>
          </div>
  )
}
