import io from "socket.io-client";

export default () => {
  const endpoint = "http://localhost:5001";
  const socket = io(endpoint);

  socket.on("tempError", err => {
    console.log("Error:", err);
    alert("Error:", err);
  })

  // EMITTERS
  const getRooms = callback => {
    console.log('getting chatrooms');
    socket.emit("getRooms", null, callback)
  }

  const getUserList = callback => {
    socket.emit("getUserList", null, callback);
  }

  const setUsername = (name, callback) => {
    socket.emit("setUsername", name, callback);
  }

  const sendMessage = (message, callback) => {
    socket.emit("message", message, callback);
  }

  const joinRoom = (name, callback) => {
    socket.emit("joinRoom", name, callback);
  }

  const leaveRoom = callback => {
    socket.emit("leaveRoom", null, callback);
  }

  const createRoom = (name, callback) => {
    socket.emit("createRoom", name, callback);
  }

  // const setChatroom = (currentRoom, newRoom, callback) => {
  //   socket.emit("setChatroom", currentRoom, newRoom, callback);
  // }

  // LISTENERS
  const listenForChatrooms = callback => {
    socket.on('rooms', callback);
  }

  const listenForMessages = callback => {
    socket.on('message', callback);
  }

  const listenForUserListUpdate = callback => {
    console.log("listening for userlist");
    socket.on("userList", callback);
  }

  const listenForChatroomName = callback => {
    socket.on("roomName", callback);
  }

  // DEV
  const checkVars = () => {
    socket.emit("checkVars");
  }
  // END DEV
  return {
    getUserList, getRooms, setUsername, sendMessage, joinRoom, leaveRoom, createRoom, listenForMessages, listenForUserListUpdate, listenForChatrooms, checkVars
  }
}
