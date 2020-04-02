const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5001;

const users = {};
const rooms = {};

io.on("connection", socket => {
  console.log("User connected");

  socket.on("getUserName", fn => {
    const num = Math.ceil(Math.random() * 99999);
    fn("guest" + num);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
