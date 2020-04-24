const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
const chatrooms = new Map();

const findName = name => {
  console.log('in findName with:', name);
  for(let [k, v] of users){
    if(v && v.toLowerCase() === name.toLowerCase()){
      return true;
    }
  }
  return false;
}

const chatroomExists = chatroomName => {
  return chatrooms.has(chatroomName);
}


const sendUserList = chatroomName => {
  const userList = Array.from(chatrooms.get(chatroomName).values());
  const userIDs = chatrooms.get(chatroomName).keys();
  console.log("userIDs:", userIDs);
  for(let id of userIDs) {
    io.to(id).emit("userList", userList);
  }
}

const sendChatroomList = () => {
  console.log('sending out chatroom list');
  const chatroomList = Array.from(chatrooms.keys());
  io.emit("chatroomList", chatroomList);
}

io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, null);

  client.on("getChatrooms", (_, callback) => {
    let chatroomNames = Array.from(chatrooms.keys());
    console.log('chatroom names:', chatroomNames);
    return callback(chatroomNames);
  })

  // TODO: REFACTOR ME
  client.on("setChatroom", (currentRoomName, newRoomName, callback) => {
    let chatroomListChanged = false;
    // leave current room
    if(currentRoomName === newRoomName){
      return callback(newRoomName);
    }

    if(currentRoomName) {
      chatrooms.get(currentRoomName).delete(client.id);
      if(chatrooms.get(currentRoomName).size === 0)
      {
        console.log('deleting chatroom:', currentRoomName);
        chatrooms.delete(currentRoomName);
        chatroomListChanged = true;
      } else {
        sendUserList(currentRoomName);
      };
    }
    // return null, user is leaving current room and not joining/creating another
    if(!newRoomName){
      if(chatroomListChanged) {
        sendChatroomList()
      };

      return callback(null);
    }
    // user is joining or creating a room, create the room if it doesn't exist
    if(!chatroomExists(newRoomName)){
      chatrooms.set(newRoomName, new Map());
      chatroomListChanged = true;
    }
    // join new room
    chatrooms.get(newRoomName).set(client.id, users.get(client.id));
    sendUserList(newRoomName);

    if(chatroomListChanged) {
      sendChatroomList()
    };

    return callback(newRoomName);
  })

  // TODO: REFACTOR ME
  client.on("setUsername", (name, callback )=> {
    const username = users.get(client.id);
    if(!name || (name !== username && findName(name))) {
      return callback(null);
    } else {
      console.log("setting name to:", name);
      users.set(client.id, name);
      return callback(name);
    }
  })

  client.on("getUserList", (chatroomName, callback) => {
    if(chatroomExists(chatroomName)) {
      let userList = Array.from(chatrooms.get(chatroomName).values());
      return callback(userList);
    }

    return callback(null);
  })

  client.on("message", (message, chatroomName, callback) => {
    console.log(`Received ${message} from ${users.get(client.id)} to ${chatroomName}`);

    const usersToMessage = chatrooms.get(chatroomName).keys();

    for(let user of usersToMessage){
      io.to(user).emit("message", message);
    }

    return callback(message);

  })

  client.on("disconnect", () => {
    console.log("User disconnected:", client.id)
    return users.delete(client.id);
  })

  //DEV
  client.on("checkVars", (_, callback) => {
    console.log('users:', users );
    console.log('rooms:', chatrooms );
  })

});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// TODO: refactor create/join/leave on client and server
// TODO: Implement context for socket()
// TODO: Error handling
// TODO: create component for username - avoid re rendering App on username edit state
// TODO: consider _ debounce on client updating chatroom/user info
// TODO: validation

// Stretch
// emote
// diceroll
// esay
