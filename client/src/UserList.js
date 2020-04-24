import React, {useState, useEffect} from "react";

export default props => {
  const [ users, setUsers ] = useState( [] );

  const { client, chatroomName } = props;

  useEffect( () => {
    client.getUserList(chatroomName, handleGetUsersResponse);
    client.listenForUserListUpdate(handleUserListUpdate);
  }, [])

  const handleUserListUpdate = userList => {
    setUsers(userList);
  }

  const handleGetUsersResponse = res => {
    console.log("get userList got:", res);
    setUsers(res);
  }

  const renderUserList = () => {
    return (
      <div>{users.map(user => <div key={user}>{user}</div>)}</div>
    )
  }



  useEffect(() => {
    console.log('hit userlist Effect');
  })

  console.log("Rendering userlist");
  return (
    <div className="userList-container">
      <div className="userList-header">Users</div>
      <div className="userList-content">{renderUserList()}</div>
    </div>
  )
}
