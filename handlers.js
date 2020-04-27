module.exports = client => {

  

  const handleGetChatrooms = (_, callback) => {
      const chatroomNames = Array.from(chatrooms.keys());
      callback(chatroomNames);
  }

  const handleJoin = () => {

  }

  const handleLeave = () => {

  }

  return {handleGetChatrooms ,handleJoin, handleLeave}
}
