import React, {useState, useEffect, useRef} from "react";

export default (props) => {
  const [chatroomList, setChatroomList] = useState([]);
  const chatroomCreateRef = useRef();

  useEffect(() => {
    console.log('ChatroomList mount');
    props.client.getChatrooms(setChatroomList);
    props.client.listenForChatrooms(onChatroomUpdate);
  }, []);

  const onChatroomUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const renderChatrooms = () => {
    if(chatroomList)
    {
      // console.log('list:', chatroomList);
      const chatroomArray = [];
      for(let i in chatroomList){
        chatroomArray.push({name: i, users: chatroomList[i]})
      }
      console.log("chatroomsArray: ", chatroomArray);

      return <>{chatroomArray.map(chatroom => <div key={chatroom.name}>{chatroom.name} ({chatroom.users.length})</div>)}</>

    } else return <div>No chatrooms available</div>
  }

  const handleCreateSubmit = e => {
    e.preventDefault();
    const roomName = chatroomCreateRef.current.value;
    console.log('submitting:', roomName);
    props.client.createChatroom(roomName, handleCreateResponse);
    chatroomCreateRef.current.value = "";
  }

  const handleCreateResponse = res => {
    if(res) {

    }
  }

  return (
          <div className="chatroomList-container">
            <div className="chatroomList-header">Chatrooms</div>
            <div className="chatroomList-content">{renderChatrooms()}</div>
            <div className="chatroomList-inputs">
              <button onClick={() => {}}>JOIN</button>
              <form><input type="text" ref={chatroomCreateRef}/ ><button onClick={handleCreateSubmit}>CREATE</button></form>
            </div>
          </div>
  )
}
