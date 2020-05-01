import React, {useState, useEffect} from "react";

export default props => {
  const [ users, setUsers ] = useState( [] );

  const { client, chatroomName } = props;

  useEffect( () => {
    client.listenForUserListUpdate(handleUserListUpdate);
    client.getUserList(handleGetUsersResponse);

    return () => client.stopListeningUserList();
  }, [])

  const handleUserListUpdate = userList => {
    console.log('got userlist:', userList);
    if(userList) setUsers(userList);
    else console.log("Something went wrong getting userlist");
  }

  const handleGetUsersResponse = res => {
    console.log("get userList got:", res);
    setUsers(res);
  }

  const renderUserList = () => {
    return (
      <>{users.map(user => <div className="userList__item" key={user}>{user}</div>)}</>
    )
  }

return (
    <div className="chatroom__userList">
      <div className="userList__header">Online</div>
      <div className="userList__content">{renderUserList()}</div>
    </div>
  )
}
