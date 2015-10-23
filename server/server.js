"use strict";
// Setup basic express server
let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io")(server);
let port = process.env.PORT || 3000;
let nsp = io.of('/chat'); // create a socket namespace

server.listen(port, function() {
    // log after server start
    console.log("Server listening at port %d", port);
});

app.get("/client-count", (req, res) => {
    // allow cross domain ajax request
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // return all connection in chat namespace
    res.json(nsp.sockets.length);
});

// serve public folder as static path
app.use(express.static(__dirname + "/public"));

io.on("connection", function(socket) {
    // initialize event receive
    socket.on("send", function(e) {
        // broadcast to all socket
        socket.broadcast.emit("receive", e);
        // send to sender
        socket.emit("receive", e);
    });
});

nsp.on('connection', function(socket) {
    // initialize event receive
    socket.on("send", function(e) {
        // broadcast to all socket
        socket.broadcast.emit("receive", e);
        // send to sender
        socket.emit("receive", e);
    });
    socket.on("disconnect", function() {
        console.info(socket.id, "disconnected");
        // tell all client to fetch new connection count
        nsp.emit("receive", {
            type: "chat",
            action: "online"
        });
    });
});
