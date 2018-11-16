p5.disableFriendlyErrors = true; // disables FES
var socket = io.connect('https://hills-connection.herokuapp.com/');
//var socket = io.connect('localhost:3000');
var r, g, b, size;
var spotsLoaded = false;
var alreadyDrawn = [];

socket.on('load-in', function(data)
{
    alreadyDrawn = data.spots;
    spotsLoaded = true;
    console.log("first")
});
        

function setup() {
    var canvas =  createCanvas(windowWidth, windowHeight);
    canvas.position(450, 0);
    
    r = 255;
    g = 0;
    b = 0;
    size = 15;
    background(51);

    //draw the loaded spots
    if(spotsLoaded)
    {
        var spotLength = alreadyDrawn.length;
        console.log("second");
        for(var i = 0; i < spotLength; i++){
            drawSpot(alreadyDrawn[i].x, alreadyDrawn[i].y, alreadyDrawn[i].s, alreadyDrawn[i].r, alreadyDrawn[i].g, alreadyDrawn[i].b);
        }
    }
    
    //Where other people's drawings are.
    socket.on('orbs', function(data){
        drawSpot(data.x, data.y, data.s, data.r, data.g, data.b);
    });
    
    //erase the entire screen
    socket.on('delete', function(data){
        background(51);
    });   
    
}
function draw(){}

function mouseDragged()
{
    //send the information
    socket.emit('orbs', {x: mouseX, y: mouseY, s: size, r: r, g: g, b: b});
    drawSpot(mouseX, mouseY, size, r, g, b);
}
function mousePressed()
{
    //send the information
    socket.emit('orbs', {x: mouseX, y: mouseY, s: size, r: r, g: g, b: b});
    drawSpot(mouseX, mouseY, size, r, g, b);
}

//delete the screen
var deleteButton = document.getElementById("deleteButton");
deleteButton.onclick = function(){
    socket.emit('delete', x = 1);
}


//Change Color Buttons
var red = document.getElementById('red');
red.onclick = function(){r = 255;  g = 0;  b = 0;}

var orange = document.getElementById('orange');
orange.onclick = function(){r = 255;  g = 165;  b = 0;}

var yellow = document.getElementById('yellow');
yellow.onclick = function(){r = 255;  g = 255;  b = 0;}

var green = document.getElementById('green');
green.onclick = function(){r = 0;  g = 255;  b = 0;}

var blue = document.getElementById('blue');
blue.onclick = function(){r = 0;  g = 0;  b = 255;}

var purple = document.getElementById('purple');
purple.onclick = function(){r = 255;  g = 0;  b = 255;}

var black = document.getElementById('black');
black.onclick = function(){r = 0;  g = 0;  b = 0;}

//Bigger and Smaller brush size buttons
var bigger = document.getElementById('bigger');
bigger.onclick = function(){
    if(size < 100)
    size += 5;
}
var smaller = document.getElementById('smaller');
smaller.onclick = function(){
    if(size > 5)
    size -= 5;
}

function drawSpot(x, y, s, r, g, b)
{
    fill(r, g, b);
    noStroke();
    ellipse(x, y, s, s);
}


//THE CHAT STUFF
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');

//emit events when shit's sent (this slient sends stuff to the server)
function sendMessage()
{
    socket.emit('chat', {message: message.value, handle: handle.value});
    message.value = "";

    //keep scrollbar at bottom
    var messageBody = document.querySelector('#output');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}

btn.addEventListener('click', function(){
    sendMessage();
});

message.addEventListener('keypress', function(e){
    if(e.keyCode === 13)
    sendMessage();
});

//Listen for events (the server sends this stuff to us)
socket.on('chat', function(data){
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    //keep scrollbar at bottom
    var messageBody = document.querySelector('#output');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
});

