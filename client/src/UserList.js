import React, {useState, useEffect} from "react";

export default props => {
  const [ users, setUsers ] = useState( [] );

  const { client, chatroomName } = props;

  useEffect( () => {
    client.listenForUserListUpdate(handleUserListUpdate);
    client.getUserList(handleGetUsersResponse);
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
      <>{users.map(user => <div className="userList-item" key={user}>{user}</div>)}</>
    )
  }



  // useEffect(() => {
  //   console.log('hit userlist Effect');
  // })

  // console.log("Rendering userlist");
  return (
    <div className="userList-container">
      <div className="userList-header">Users</div>
      <div className="userList-content">{renderUserList()}</div>
    </div>
  )
}
