import io from "socket.io-client";

export default () => {
  const endpoint = "http://localhost:5001";
  const socket = io(endpoint);

  socket.on("tempError", err => {
    console.log("Error:", err);
    alert("Error:", err);
  })

  // EMITTERS
  const getChatrooms = callback => {
    socket.emit("getChatrooms", null, callback)
  }

  const getUserList = (chatroomName, callback) => {
    socket.emit("getUserList", chatroomName, callback);
  }

  const setUsername = (newName, currentName, chatroomName, callback) => {
    socket.emit("setUsername", newName, currentName, chatroomName, callback);
  }

  const sendMessage = (message, chatroomName, callback) => {
    socket.emit("message", message, chatroomName, callback);
  }

  const setChatroom = (currentRoom, newRoom, callback) => {
    socket.emit("setChatroom", currentRoom, newRoom, callback);
  }

  // LISTENERS
  const listenForChatrooms = callback => {
    socket.on('chatroomList', callback);
  }

  const listenForMessages = callback => {
    socket.on('message', callback)
  }

  const listenForUserListUpdate = callback => {
    socket.on("userList", callback);
  }

  const listenForChatroomName = callback => {
    socket.on("chatroomName", callback);
  }

  // DEV
  const checkVars = () => {
    socket.emit("checkVars");
  }
  // END DEV
  return {
    getUserList, getChatrooms, setUsername, sendMessage, setChatroom, listenForMessages, listenForUserListUpdate, listenForChatrooms, checkVars
  }
}
