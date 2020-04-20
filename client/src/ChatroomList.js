import React, {useState, useEffect} from "react";

export default (props) => {
  console.log('loading chatroomlist');
  const [chatroomList, setChatroomList] = useState([]);

  useEffect(() => {
    console.log('ChatroomList mounted');
    props.client.getChatrooms(setChatroomList);
    props.client.listenForChatrooms(onChatroomUpdate);
  }, []);

  const onChatroomUpdate = chatroomList => {
    setChatroomList(chatroomList);
  }

  const renderChatrooms = () => {
    if(chatroomList)
    {
      console.log('list:', chatroomList);
      const chatroomArray = [];
      for(let i in chatroomList){
        chatroomArray.push({name: i, users: chatroomList[i]})
      }
      console.log("chatroomArray: ", chatroomArray);

      return <>{chatroomArray.map(chatroom => <div key={chatroom.name}>{chatroom.name} ({chatroom.users.length})</div>)}</>

    } else return <div>No chatrooms available</div>
  }

  return (<div>
            MY CHATROOM LIST COMPONENT
            <div>{renderChatrooms()}</div>
          </div>)
}
