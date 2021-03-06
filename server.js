const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = new Map();
const rooms = new Map();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

io.on("connection", client => {
  users.set(client.id, {username: null, userRoom: null});

  //// HELPERS /////////////////
  const nameExists = name => {
    for(let [k, v] of users){
      if(v.username && v.username.toLowerCase() === name.toLowerCase()){
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
    const userList = Array.from(rooms.get(room).values());
    io.to(room).emit("userList", userList);
  }

  const emitRooms = () => {
    const roomsList = Array.from(rooms.keys());
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
    client.join(roomName, () => {
      const content = `${username} joined the room.`;
      client.to(roomName).emit("message", {user: null, content});
      emitUserList(roomName);
      callback(roomName);
    });
  }

  const userCreateRoom = (room, callback) => {
    if(room.length > 27 || rooms.length < 1 || roomExists(room) || !room.replace(/\s/g, '').length) {
      return callback(null);
    }

    const {username, userRoom} = users.get(client.id);
    userLeaveRoom();
    rooms.set(room, new Map());
    rooms.get(room).set(client.id, username);
    users.set(client.id, {username, userRoom: room});

    client.join(room, () => {
      emitRooms();
      emitUserList(room);
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
    if(!name || nameExists(name) || name.length > 22) {
      console.log('invalid name');
      return callback({message:"Name is taken or invalid. Try another name."});
    } else {
      const {username, userRoom} = users.get(client.id);
      users.set(client.id, {username: name, userRoom});
      if(userRoom) {
        const content = `${username} changed name to ${name}.`;
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
    if(content.length < 1){
      return callback(null);
    }
    const {username, userRoom} = users.get(client.id);
    client.to(userRoom).emit("message", {username, content});
    callback({username, content});
  })

  client.on("disconnect", () => {
    userLeaveRoom();
    users.delete(client.id);
  })

});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
