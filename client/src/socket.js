import io from "socket.io-client";

export default () => {
  const endpoint = "http://localhost:5001";
  const socket = io(endpoint);

  socket.on("tempError", err => {
    console.log("Error:", err);
    alert("Error:", err);
  })

  const getChatrooms = callback => {
    socket.emit("getChatrooms", null, callback)
  }

  const createChatroom = (chatroomName, callback) => {
    socket.emit("createChatroom", chatroomName, callback);
  }

  const setUsername = (name, callback) => {
    socket.emit("setUsername", name, callback);
  }

  const sendMessage = message => {
    console.log('got a message');
    socket.emit("message", message);
  }

  const joinChatroom = (chatroomName, callback) => {
    socket.emit("joinChatroom", chatroomName, callback);
  }

  const listenForChatrooms = callback => {
    socket.on('chatroomList', callback);
  }

  const listenForMessages = callback => {
    socket.on('message', callback)
  }

  const listenForUserList = callback => {
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
    getChatrooms, createChatroom, setUsername, joinChatroom, sendMessage, listenForMessages, listenForUserList, listenForChatrooms, listenForChatroomName, checkVars
  }
}
