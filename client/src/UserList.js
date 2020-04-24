import React, {useState, useEffect} from "react";

export default props => {
  const [users, setUsers] = useState([]);

  const {client} = props;

  useEffect(() => {
    client.listenForUserList(setUsers);
  },[]);

  const renderUserList = () => {
    return (
      <div>{users.map(user => <div key={user}>{user}</div>)}</div>
    )
  }

  return (
    <div className="userList-container">
      <div className="userList-header">Users</div>
      <div className="userList-content">{renderUserList()}</div>
    </div>
  )
}
