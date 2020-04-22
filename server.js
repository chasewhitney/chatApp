const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();

const rooms = {};

//rooms["Room One"] = ["Ornn", "Octavio", "Oliver"];

const findName = name => {
  for(let [k, v] of users){
    if(v && v.toLowerCase() === name.toLowerCase()){
      return true;
    }
  }
  return false;
}

io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, null);

  client.on("getChatrooms", (_, callbackFn) => {
    // console.log("Sending rooms:", rooms);
    callbackFn(rooms);
  })

  client.on("createChatroom", chatroomName => {
    // TODO: remove user from current room -> remove room if empty
    rooms[chatroomName] = [users.get(client.id)];
    client.emit("updateChatrooms", rooms);
    // client.emit("userJoinChatroom", chatroomName);
    //or client send (name, null, callback), server broadcasts
  })

  client.on("setUsername", (name, callback )=> {
    console.log('setUsername got:', name);
    if(name !== users.get(client.id) && findName(name)) {
      console.log('setUsername returning null');
      callback(null);
    } else {
      console.log('setUsername returning', name);
      users.set(client.id, name);
      callback(name);
    }
  })

  client.on("message", message => {
    console.log('got message, sending it back');
    client.emit("message", message);
  })

  client.on("disconnect", () => {
    console.log("User disconnected:", client.id)
    users.delete(client.id);
  })

});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



// TODO: create component for username - avoid re rendering App on username edit state
// TODO: broadcast vs emit: createChatroom
// TODO: consider _ debounce on client updating chatroom/user info
// TODO: validation

// Stretch
