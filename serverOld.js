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
  console.log('emitting userList:', userList);
  io.to(chatroomName).emit("userList", userList);
}

// DRY
const emitChatroomList = () => {
  const chatroomList = Array.from(chatrooms.keys());
  io.emit("chatroomList", chatroomList);
}

io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, null);

// DRY
  client.on("getChatrooms", (_, callback) => {
    const chatroomNames = Array.from(chatrooms.keys());
    callback(chatroomNames);
  })

  // TODO: REFACTOR ME
  client.on("setChatroom", (currentRoomName, newRoomName, callback) => {
    let chatroomListChanged = false;

    if(currentRoomName === newRoomName){
      return callback(newRoomName);
    }

    //// leave current room ////
    if(currentRoomName) {

      // DRY
      const content = `${users.get(client.id)} left the room.`;
      client.to(currentRoomName).emit("message", {user: null, content});
      chatrooms.get(currentRoomName).delete(client.id);
      client.leave(currentRoomName);
      client.currentChatroom = null;

      if(chatrooms.get(currentRoomName).size === 0)
      {
        chatrooms.delete(currentRoomName);
        chatroomListChanged = true;
      } else {
        sendUserList(currentRoomName);
      };
    }

    //// handle create, join if applicable ////
    // user not entering a room: return null
    if(!newRoomName){
      if(chatroomListChanged) {
        emitChatroomList()
      };

      return callback(null);
    }

    //// user creating new room: create room
    if(!chatroomExists(newRoomName)){
      chatrooms.set(newRoomName, new Map());
      chatroomListChanged = true;
    }

    //// add user to room

    client.join(newRoomName, () => {
      chatrooms.get(newRoomName).set(client.id, users.get(client.id));
      client.currentChatroom = newRoomName;
      const content = `${users.get(client.id)} joined the room.`;
      client.to(newRoomName).emit("message", {user: null, content});
      sendUserList(newRoomName);

      if(chatroomListChanged) {
        emitChatroomList()
      };

      callback(newRoomName);
    });
  })

  // TODO: REFACTOR ME
  client.on("setUsername", (newName, oldName, chatroomName, callback )=> {
    // console.log("newName:", newName);
    // console.log("oldName:", oldName);
    // console.log("chatroomName:", chatroomName);
    // console.log("callback:", callback);

    if(!newName || (newName !== oldName && findName(newName))) {
      return callback(null);
    } else {
      console.log("setting name to:", newName);
      users.set(client.id, newName);
      const content = `${oldName} changed name to ${newName}`;
      client.to(chatroomName).emit("message", {user:null, content});
      callback(newName);
    }
  })

  client.on("getUserList", (chatroomName, callback) => {
    if(chatroomExists(chatroomName)) {
      let userList = Array.from(chatrooms.get(chatroomName).values());
      return callback(userList);
    } else {
      callback(null);
    }
  })

  client.on("message", (content, chatroomName, callback) => {
    const user = users.get(client.id)
    console.log(`Received ${content} from ${user} to ${chatroomName}`);

    // const usersToMessage = chatrooms.get(chatroomName).keys();
    // for(let user of usersToMessage){
    //   io.to(user).emit("message", message);
    // }

    client.to(chatroomName).emit("message", {user, content});

    callback({user, content});

  })

  client.on("disconnect", () => {
    console.log("User disconnected:", client.id)
    console.log("was in room:", client.currentChatroom)

    //DRY
    const {currentChatroom} = client;

    if(currentChatroom) {
      const content = `${users.get(client.id)} left the room.`;
      client.to(currentChatroom).emit("message", {user: null, content});
      chatrooms.get(currentChatroom).delete(client.id);

      if(chatrooms.get(currentChatroom).size === 0)
      {
        chatrooms.delete(currentChatroom);
        chatroomListChanged = true;
      } else {
        sendUserList(currentChatroom);
      };
    }

    users.delete(client.id);
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
