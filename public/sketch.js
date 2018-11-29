//p5.disableFriendlyErrors = true; // disables FES
var socket = io.connect('https://hills-connection.herokuapp.com/');
//var socket = io.connect('localhost:3000');
var size;
var color;
var alreadyDrawn = [];

window.onload = function(){
    socket.emit('load-in');
    console.log("sending");
}

function setup() {
    var canvas =  createCanvas(windowWidth, windowHeight);
    canvas.position(450, 0);
    frameRate(10);
    size = 15;
    color = '#ff0000';
    background(51);
    
    socket.on('load-in', function(data){  
        alreadyDrawn = data.spots;
        console.log("first")
    });

    //draw the loaded spots
    setTimeout(function(){
        var spotLength = alreadyDrawn.length;
        console.log("second");
        for(var i = 0; i < spotLength; i++){
            drawSpot(alreadyDrawn[i].x, alreadyDrawn[i].y, alreadyDrawn[i].s, alreadyDrawn[i].color);
        }
    }, 500);
        
    
    //Where other people's drawings are.
    socket.on('orbs', function(data){
        drawSpot(data.x, data.y, data.s, data.color);
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
    socket.emit('orbs', {x: mouseX, y: mouseY, s: size, color: color});
    drawSpot(mouseX, mouseY, size, color);
}
function mousePressed()
{
    //send the information
    socket.emit('orbs', {x: mouseX, y: mouseY, s: size, color: color});
    drawSpot(mouseX, mouseY, size, color);
}

//delete the screen
var deleteButton = document.getElementById("deleteButton");
deleteButton.onclick = function(){
    socket.emit('delete', x = 1);
}


//Change Color Buttons
var red = document.getElementById('red');
red.onclick = function(){color = '#ff0000';}

var orange = document.getElementById('orange');
orange.onclick = function(){color = '#ff6600';}

var yellow = document.getElementById('yellow');
yellow.onclick = function(){color = '#ffff00';}

var green = document.getElementById('green');
green.onclick = function(){color = '#008000';}

var blue = document.getElementById('blue');
blue.onclick = function(){color = '#0000ff';}

var purple = document.getElementById('purple');
purple.onclick = function(){color = '#800080';}

var black = document.getElementById('black');
black.onclick = function(){color = '#000000';}

var white = document.getElementById('white');
white.onclick = function(){color = '#ffffff';}

var customChooser = document.getElementById('chooser');
var custom = document.getElementById('custom');
custom.onclick = function(){
    custom.style.background = customChooser.value;
    color = customChooser.value;
}

//Bigger and Smaller brush size buttons
var slider = document.getElementById("range");
var strokeSize = document.getElementById("size");
strokeSize.innerHTML = slider.value;

slider.oninput = function(){
    size = (int)(this.value);
    strokeSize.innerHTML = slider.value;
}




//THE CHAT STUFF
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');

//emit events when shit's sent (this slient sends stuff to the server)
function sendMessage()
{
    if(message.value.length > 0 && handle.value.length > 0)
    {
        socket.emit('chat', {message: message.value, handle: handle.value});
        message.value = "";

        //keep scrollbar at bottom
        var messageBody = document.querySelector('#output');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }
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

function drawSpot(x, y, s, c)
{
    fill(c);
    noStroke();
    ellipse(x, y, s, s);
}
