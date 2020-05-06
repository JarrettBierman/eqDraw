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

//This whole function manages the connections, put all client/server related connection code here
io.on('connection', function(socket){
    console.log(socket.id + " has joined");
    console.log("there are " + Object.keys(io.sockets.connected).length + " people online");
    // console.log(Object.keys(io.sockets.connected));

    //person joining
    socket.on('iJoined', function(){
        // console.log("The new client has informed us that he has joined")
        io.emit('personJoin', {joined: socket.id, everyone: Object.keys(io.sockets.connected)});
    });
    

    //draw the orbs
    socket.on('orbs', function(data){
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

    //person leaving
    socket.on('disconnect', function(){
        console.log(socket.id + " has left");
        console.log("there are " + Object.keys(io.sockets.connected).length + " people online");
        // console.log(Object.keys(io.sockets.connected));
        io.emit('personLeft', {left: socket.id, remaining: Object.keys(io.sockets.connected)});
    });

});

//helper functions
