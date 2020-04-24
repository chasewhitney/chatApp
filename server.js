const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
// user: (client.id, name)

// const chatrooms = {};
// // chatrooms["Room One"] = Map(client.id, name)
// chatrooms["Test One"] = new Map();
// chatrooms["Test One"].set(12345, "Robodude");

const chatrooms = new Map();
chatrooms.set("Test Room One", new Map());

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

const createNewChatroom = chatroomName => {

}

const leaveChatroom = user => {
  user.chatroom = null;
  return user;
}

io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, null);

  client.on("getChatrooms", (_, callback) => {
    let chatroomNames = Array.from(chatrooms.keys());
    console.log('chatroom names:', chatroomNames);
    callback(chatroomNames);
  })

  // REFACTOR ME
  client.on("createChatroom", (chatroomName, callback) => {
    let user = users.get(client.id);
    if(chatroomName && !chatroomExists(chatroomName)) {
      // create chatroom
      createNewChatroom(chatroomName);
      // if user in chatroom, user leaves current chatroom
      if(user.chatroom) {
        user = leaveChatroom(user);
      }
      // user join new room
      user = joinChatroom(user, chatroomName);
      // broadcast updated chatroom list
      io.emit("updateChatrooms", chatrooms);
      // handle success...
      client.emit("userList", chatrooms[chatroomName]);
    } else {
      client.emit("tempError", "Could not create chatroom");
    }
  })

  // TODO: REFACTOR ME
  client.on("setUsername", (name, callback )=> {
    const username = users.get(client.id);

    if(!name || (name !== username && findName(name))) {
      callback(null);
    } else {
      users.set(client.id, name);
      callback(name);
    }
  })

  client.on("joinChatroom", (chatroomName, callback) => {
    if(chatroomExists(chatroomName)) {
      console.log('chatrooms pre user add:', chatrooms);
      chatrooms.get(chatroomName).set(client.id, users.get(client.id));
      console.log('chatrooms post user add:', chatrooms);
      // UPDATE USERLIST
      callback(chatroomName);
    } else {
      callback(null);
    }
  })

  client.on("message", (message, chatroom) => {
    // console.log(`Received ${message} from ${users.get(client.id)}`);
  })

  client.on("disconnect", () => {
    console.log("User disconnected:", client.id)
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
