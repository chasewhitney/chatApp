const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
const rooms = new Map();


io.on("connection", client => {
  console.log("User connected:", client.id);
  users.set(client.id, {username: null, userRoom: null});

  //// HELPERS /////////////////

  const nameExists = name => {
    for(let [k, v] of users){
      if(v.name && v.name.toLowerCase() === name.toLowerCase()){
        return true;
      }
    }
    return false;
  }

  const roomExists = room => {
    const roomsArr = Array.from(rooms.keys());
    return !roomsArr.every((roomItem) => roomItem.toLowerCase() != room.toLowerCase());
  }

  const emitUserList = room => {
    console.log('emitting userlist to room:', room);
    const userList = Array.from(rooms.get(room).values());
    console.log('emitting userList:', userList);
    io.to(room).emit("userList", userList);
  }

  const emitRooms = () => {
    const roomsList = Array.from(rooms.keys());
    console.log('emitting rooms with:', roomsList);
    io.emit("rooms", roomsList);
  }

  const userLeaveRoom = (_, callback) => {
    const {username, userRoom} = users.get(client.id);
    if(userRoom) {
      const content = `${username} left the room.`;
      client.to(userRoom).emit("message", {user: null, content});
      rooms.get(userRoom).delete(client.id)
      users.set(client.id, {username, userRoom: null});
      client.leave(userRoom);
      if(rooms.get(userRoom).size === 0) {
        rooms.delete(userRoom);
        emitRooms();
      } else {
        emitUserList(userRoom);
      };
    }

    if(callback) callback(null);
  }

  const userJoinRoom = (roomName, callback) => {
    const {username, userRoom} = users.get(client.id);

    if(!roomExists(roomName) || roomName === userRoom) {
      return callback(null);
    }

    userLeaveRoom();
    const room = rooms.get(roomName);
    room.set(client.id, username);
    users.set(client.id, {username, userRoom: roomName});
    console.log('joining room..');
    client.join(roomName, () => {
      const content = `${username} joined the room.`;
      client.to(roomName).emit("message", {user: null, content});
      emitUserList(roomName);
      callback(roomName);
    });
  }




  const userCreateRoom = (room, callback) => {
    const {username, userRoom} = users.get(client.id);

    if(roomExists(room)) {
      return callback(null);
    }

    userLeaveRoom();
    rooms.set(room, new Map());
    rooms.get(room).set(client.id, username);
    users.set(client.id, {username, userRoom: room});

    client.join(room, () => {
      console.log('in createroom with, about to send rooms..');
      emitRooms();
      callback(room);
    });
  }

  //// LISTENERS ///////////////////////

  client.on("registerUser", ( _,callback) => {
    let newName = "GUEST-" + Math.ceil( Math.random() * 9999 );

    while(nameExists(newName)){
      newName = "GUEST-" + Math.ceil( Math.random() * 9999 );
    }

    users.set(client.id, {username: newName, userRoom: null});
    callback(newName);
  })


  client.on("getRooms", (_, callback) => {
    const roomsArr = Array.from(rooms.keys());
    callback(roomsArr);
  })

  client.on("joinRoom", userJoinRoom);

  client.on("leaveRoom", userLeaveRoom);

  client.on("createRoom", userCreateRoom);

  client.on("changeUsername", (name, callback ) => {
    const {username, userRoom} = users.get(client.id);

    if(!name || nameExists(name)) {
      callback({message:"Name is taken or invalid. Try another name."});
    } else {
      users.set(client.id, {username: name, userRoom});
      if(userRoom) {
        const content = `${username} changed name to ${name}`;
        client.to(userRoom).emit("message", {user:null, content});
        rooms.get(userRoom).set(client.id, name);
        emitUserList(userRoom);
      }

      callback(name);
    }
  })

  client.on("getUserList", (_, callback) => {
    const {userRoom} = users.get(client.id);
    if(userRoom) {
      const userList = Array.from(rooms.get(userRoom).values());
      callback(userList);
    } else {
      callback();
    }
  })

  client.on("message", (content, callback) => {
    const {username, userRoom} = users.get(client.id);

    console.log(`Received ${content} from ${username} to ${userRoom}`);
    client.to(userRoom).emit("message", {username, content});
    callback({username, content});
  })

  client.on("disconnect", () => {
    console.log("User disconnected:", client.id)
    console.log("was in room:", client.currentChatroom)

    userLeaveRoom();
    users.delete(client.id);
  })


  client.on("checkVars", (_, callback) => {
    console.log('users:', users );
    console.log('rooms:', rooms );
  })

});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});





// TODO: (FIX) creating a new room while in an existing room does not reset/update the chatlog or the userlist
// TODO: (FIX) chatlog stretches div vertically when window fills
// TODO: chatLog should scroll to bottom after each message when window is full


// Stretch
// emote
// diceroll
// esay
