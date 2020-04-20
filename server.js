const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();

// const rooms = new Map();
// rooms.set("Room One", ["Ornn", "Octavio", "Oliver"]);
// rooms.set("Room Two", ["Terry", "Tim", "Tom"]);
// rooms.set("Room Three", ["Thidwick", "Thurgood", "Thadius"]);

/// DEV
users.set(1, "Ornn");
users.set(2, "Octavio");
users.set(3, "Oliver");
users.set(4, "Terry");
users.set(5, "Tim");
users.set(6, "Tom");
users.set(7, "Fred");
users.set(8, "Francis");
users.set(9, "Fiora");

const rooms = {};
rooms["Room One"] = ["Ornn", "Octavio", "Oliver"];
rooms["Room Two"] = ["Terry", "Tim", "Tom"];
rooms["Room Four"] = ["Fred", "Francis", "Fiora"];
/// END DEV

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
    rooms[chatroomName] = [users.get(client.id)];
    client.emit("updateChatrooms", rooms);
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
