const server = require("http").createServer();
const io = require("socket.io")(server);
const handlers = require("./handlers");

const PORT = process.env.PORT || 5001;

io.on("connection", client => {

  const {handleJoin, handleLeave, handleGetChatrooms, handleSetChatroom, handleSetUsername, handleGetUserList, handleMessage, handleDisconnect} = handlers(client, io);

  client.on("getChatrooms", handleGetChatrooms);

  client.on("setChatroom", handleSetChatroom);

  client.on("setUsername", handleSetUsername);

  client.on("getUserList", handleGetUserList);

  client.on("message", handleMessage);

  client.on("disconnect", handleDisconnect)
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});





// userlist not being sent upon room join

// TODO: refactor create/join/leave on client and server
// TODO: Implement context for socket()
// TODO: Error handling
// TODO: create component for username - avoid re rendering App on username edit state

// TODO: validation

// Stretch
// emote
// diceroll
// esay
