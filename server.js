var express = require('express');
var socket = require('socket.io');
var spots = [];

//setup
var app = express();
var server = app.listen((process.env.PORT || 3000), '0.0.0.0', function(){
    console.log("listening now.")
});

//static files / middleware setup
app.use(express.static('public'));

//set up the socket
var io = socket(server); //we want this socket to work with this server.
io.on('connection', function(socket){//when a client connects, this code runs :)
    console.log("new connection: " + socket.id);

    //draw the orbs
    socket.on('orbs', function(data){
        // spots.push({x: data.x, y: data.y, s: data.s, r: data.r, g: data.g, b: data.b});
        spots.push({x: data.x, y: data.y, s: data.s, color: data.color});
        socket.broadcast.emit('orbs', data);
    });

    //load in of orbs
    socket.on('load-in', function(){
        io.emit('load-in', {spots: spots});
    });


    
    //the chat text
    socket.on('chat', function(data){//here, the server is sending stuff to all of the clients
        io.emit('chat', data);
    });

    //the delete function
    socket.on('delete', function(data){
        spots = [];
        io.emit('delete', data);
    });

});