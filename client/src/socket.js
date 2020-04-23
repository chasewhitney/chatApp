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

  const listenForChatrooms = callback => {
    socket.on('updateChatrooms', callback);
  }

  const createChatroom = (chatroomName, callback) => {
    socket.emit("createChatroom", chatroomName, callback);
  }

  const setUsername = (name, callback) => {
    socket.emit("setUsername", name, callback);
  }

  const listenForMessages = callback => {
    socket.on('message', callback)
  }

  const sendMessage = message => {
    console.log('got a message');
    socket.emit("message", message);
  }

  const listenForUserList = callback => {
    socket.on("userList", callback);
  }


  // DEV
  const checkVars = () => {
    socket.emit("checkVars");
  }
  // END DEV
  return {
    getChatrooms, listenForChatrooms, createChatroom, setUsername, listenForMessages, sendMessage, listenForUserList, checkVars
  }
}
