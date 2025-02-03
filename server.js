const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("remote-mouse", (event) => {
        socket.broadcast.emit("move-mouse", event);
    });

    socket.on("remote-key", (event) => {
        socket.broadcast.emit("press-key", event);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
