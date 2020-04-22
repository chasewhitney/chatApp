import io from "socket.io-client";

export default () => {
  const endpoint = "http://localhost:5001";
  const socket = io(endpoint);

  const getChatrooms = callback => {
    socket.emit("getChatrooms", null, callback)
  }

  const listenForChatrooms = callback => {
    socket.on('updateChatrooms', callback);
  }

  const createChatroom = chatroomName => {
    socket.emit("createChatroom", chatroomName);
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


  return {
    socket, getChatrooms, listenForChatrooms, createChatroom, setUsername, listenForMessages, sendMessage
  }
}
