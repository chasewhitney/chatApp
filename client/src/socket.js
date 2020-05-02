import io from "socket.io-client";

export default () => {
  const endpoint =
    process.env.NODE_ENV === "production"
      ? window.location.hostname
      : "http://localhost:5001";


  const socket = io(endpoint, {secure: true});

  socket.on("tempError", err => {
    console.log("Error:", err);
    alert("Error:", err);
  })

  // EMITTERS

  const registerUser = callback => {
    socket.emit("registerUser", null, callback);
  }

  const getRooms = callback => {
    socket.emit("getRooms", null, callback)
  }

  const getUserList = callback => {
    socket.emit("getUserList", null, callback);
  }

  const changeUsername = (name, callback) => {
    socket.emit("changeUsername", name, callback);
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

  // LISTENERS
  const listenForChatrooms = callback => {
    console.log('Listening for chatrooms');
    socket.on('rooms', callback);
  }

  const listenForMessages = callback => {
    console.log('Listening for messages');
    socket.on('message', callback);
  }

  const listenForUserListUpdate = callback => {
    console.log("Listening for userList");
    socket.on("userList", callback);
  }

  // REMOVE LISTENERS
  const stopListeningRooms = () => {
    console.log('Stopped listening for chatrooms');
    socket.removeAllListeners('rooms');
  }

  const stopListeningMessages = () => {
    console.log('Stopped listening for messages');
    socket.removeAllListeners('message');
  }

  const stopListeningUserList = () => {
    console.log('Stopped listening for userList');
    socket.removeAllListeners('userList');
  }

  // const listenForChatroomName = callback => {
  //   socket.on("roomName", callback);
  // }

  // DEV
  const checkVars = () => {
    socket.emit("checkVars");
  }
  // END DEV
  return {
    registerUser, getRooms, getUserList, changeUsername, sendMessage, joinRoom, leaveRoom, createRoom, listenForChatrooms, listenForMessages, listenForUserListUpdate, stopListeningRooms, stopListeningMessages, stopListeningUserList, checkVars
  }
}
