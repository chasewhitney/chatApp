const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
// user: (client.id, {name, chatroom})

const chatrooms = {};
// chatrooms["Room One"] = ["Ornn", "Octavio", "Oliver"];

const findName = name => {
  console.log('in findName with:', name);
  for(let [k, v] of users){
    if(v.name && v.name.toLowerCase() === name.toLowerCase()){
      return true;
    }
  }
  return false;
}

const chatroomExists = chatroomName => {
  return chatrooms[chatroomName];
}

const createNewChatroom = chatroomName => {
  chatrooms[chatroomName] = [];
}

const leaveChatroom = user => {
  user.chatroom = null;
  return user;
}

const joinChatroom = (user, chatroomName) => {
  user.chatroom = chatroomName;
  chatrooms[chatroomName].push(user.name);
  return user;
}

io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, {name: null, chatroom: null});

  client.on("getChatrooms", (_, callback) => {
    // console.log("Sending chatrooms:", chatrooms);
    callback(chatrooms);
  })

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
      client.broadcast.emit("updateChatrooms", chatrooms);
      // handle success...

      client.emit("joinChatroom", chatroomName);
      client.emit("userList", chatrooms[chatroomName]);
    } else {
      client.emit("tempError", "Could not create chatroom");
    }
  })

  client.on("setUsername", (name, callback )=> {
    console.log('in setUsername with:', name);
    const userObj = users.get(client.id);
    console.log('userObj:', userObj);
    console.log('setUsername got:', name);
    if(name !== userObj.name && findName(name)) {
      console.log('setUsername returning null');
      callback(null);
    } else {
      console.log('setUsername returning', name);
      userObj.name = name;
      users.set(client.id, userObj);
      console.log('new userObj:', users.get(client.id));
      callback(name);
    }
  })

  client.on("initializeUsername", () => {

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

// TODO: Implement context for socket()
// TODO: Better error handling
// TODO: create component for username - avoid re rendering App on username edit state
// TODO: broadcast vs emit: createChatroom
// TODO: consider _ debounce on client updating chatroom/user info
// TODO: validation

// Stretch
