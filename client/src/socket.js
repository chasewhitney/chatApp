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
    socket.on('rooms', callback);
  }

  const listenForMessages = callback => {
    socket.on('message', callback);
  }

  const listenForUserListUpdate = callback => {
    socket.on("userList", callback);
  }

  // REMOVE LISTENERS
  const stopListeningRooms = () => {
    socket.removeAllListeners('rooms');
  }

  const stopListeningMessages = () => {
    socket.removeAllListeners('message');
  }

  const stopListeningUserList = () => {
    socket.removeAllListeners('userList');
  }

  return {
    registerUser, getRooms, getUserList, changeUsername, sendMessage, joinRoom, leaveRoom, createRoom, listenForChatrooms, listenForMessages, listenForUserListUpdate, stopListeningRooms, stopListeningMessages, stopListeningUserList
  }
}
