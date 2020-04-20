import io from "socket.io-client";

export default () => {
  const endpoint = "http://localhost:5001";
  const socket = io(endpoint);

  const getChatrooms = callback => {
    console.log('getting chatrooms..');
    socket.emit("getChatrooms", null, callback)
  }

  const listenForChatrooms = callback => {
    console.log('in updateChatrooms in socket.js');
    socket.on('updateChatrooms', callback);
  }

  const createChatroom = chatroomName => {
    socket.emit("createChatroom", chatroomName);
  }

  const setUsername = (name, callback) => {
    socket.emit("setUsername", name, callback);
  }


  return {
    getChatrooms, listenForChatrooms, createChatroom, setUsername
  }
}
