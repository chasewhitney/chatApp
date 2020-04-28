const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
const rooms = new Map();

/////////


//////////////////////////////////////////////////////////
io.on("connection", client => {

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
    io.emit("rooms", roomsList);
  }

  const userLeaveRoom = (_, callback) => {

    const {username, userRoom} = users.get(client.id);
      if(userRoom) {
        console.log('leaving rooms..');
        const content = `${username} left the room.`;
        client.to(userRoom).emit("message", {user: null, content});
        client.leave(userRoom, () => {
          console.log('in userLeaveroom:',rooms.get(userRoom));
          rooms.get(userRoom).delete(client.id)
          if(rooms.get(userRoom).size === 0)
          {
            rooms.delete(userRoom);
            emitRooms(userRoom);
          } else {
            emitUserList(userRoom);
          };
          users.set(client.id, {username, userRoom: null});
        });
      }
      callback ? callback("Done") : null;
  }

  const userJoinRoom = (room, callback) => {
    const {username, userRoom} = users.get(client.id);

    if(!roomExists(room)) {
      return callback(null);
    }
    userLeaveRoom();
    rooms.get(room).set(client.id, username);
    users.set(client.id,{username, userRoom: room});
    console.log('joining room..');
    client.join(room, () => {
      console.log('emitting userlist to:', room);
      emitUserList(room);
    });
    callback(room);
  }

  const userCreateRoom = (room, callback) => {
    console.log('in createroom with 1 :', room);
    const {username, userRoom} = users.get(client.id);

    if(roomExists(room)) {
      return callback(null);
    }
    userLeaveRoom();
    console.log('in createroom with 2 :', room);
    rooms.set(room, new Map());
    rooms.get(room).set(client.id, username);
    users.set(client.id, {username, userRoom: room});
    console.log('in createroom with 3 :', room);
    client.join(room, () => {
      console.log('in createroom with 4 :', room);
      emitUserList(room);
    });
    emitRooms();

    callback(room);
  }

  console.log("User connected:", client.id);
  users.set(client.id, {username: null, userRoom: null});
  const {username, userRoom} = users.get(client.id);


// DRY
  client.on("getRooms", (_, callback) => {
    const roomsArr = Array.from(rooms.keys());
    callback(roomsArr);
  })

  client.on("joinRoom", userJoinRoom);

  client.on("leaveRoom", userLeaveRoom);

  client.on("createRoom", userCreateRoom);


  // TODO: REFACTOR ME
  client.on("setUsername", (name, callback ) => {
    const {username, userRoom} = users.get(client.id);

    if(!name || nameExists(name)) {
      return callback(null);
    } else {
      const content = `${username} changed name to ${name}`;
      client.to(userRoom).emit("message", {user:null, content});
      users.set(client.id, {username: name, userRoom});
      console.log('users:', users);
      callback(name);
    }
  })

  client.on("getUserList", (_, callback) => {
    const {userRoom} = users.get(client.id);
    if(userRoom) {
      const userList = Array.from(rooms.get(userRoom).values());
      return callback(userList);
    } else {
      callback(null);
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

    //DRY
    userLeaveRoom();

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





// client not getting userlist upon room creation, userlist component possibly not rendered soon enough

// TODO: refactor create/join/leave on client and server
// TODO: Implement context for socket()
// TODO: Error handling
// TODO: create component for username - avoid re rendering App on username edit state

// TODO: validation

// Stretch
// emote
// diceroll
// esay




  // client.on("setChatroom", (currentRoomName, newRoomName, callback) => {
  //   let chatroomListChanged = false;
  //
  //   if(currentRoomName === newRoomName){
  //     return callback(newRoomName);
  //   }
  //
  //   //// leave current room ////
  //   if(currentRoomName) {
  //
  //     // DRY
  //     const content = `${users.get(client.id)} left the room.`;
  //     client.to(currentRoomName).emit("message", {user: null, content});
  //     chatrooms.get(currentRoomName).delete(client.id);
  //     client.leave(currentRoomName);
  //     client.currentChatroom = null;
  //
  //     if(chatrooms.get(currentRoomName).size === 0)
  //     {
  //       chatrooms.delete(currentRoomName);
  //       chatroomListChanged = true;
  //     } else {
  //       emitUserList(currentRoomName);
  //     };
  //   }
  //
  //   //// handle create, join if applicable ////
  //   // user not entering a room: return null
  //   if(!newRoomName){
  //     if(chatroomListChanged) {
  //       emitChatroomList()
  //     };
  //
  //     return callback(null);
  //   }
  //
  //   //// user creating new room: create room
  //   if(!chatroomExists(newRoomName)){
  //     chatrooms.set(newRoomName, new Map());
  //     chatroomListChanged = true;
  //   }
  //
  //   //// add user to room
  //
  //   client.join(newRoomName, () => {
  //     chatrooms.get(newRoomName).set(client.id, users.get(client.id));
  //     client.currentChatroom = newRoomName;
  //     const content = `${users.get(client.id)} joined the room.`;
  //     client.to(newRoomName).emit("message", {user: null, content});
  //     emitUserList(newRoomName);
  //
  //     if(chatroomListChanged) {
  //       emitChatroomList()
  //     };
  //
  //     callback(newRoomName);
  //   });
  // })
