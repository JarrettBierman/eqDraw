//p5.disableFriendlyErrors = true; // disables FES
var socket = io.connect('https://hills-connection.herokuapp.com/');
//var socket = io.connect('localhost:3000');
var r, g, b, size;
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
    color = '#ff0000';
    r = 255;
    g = 0;
    b = 0;
    size = 15;
    background(51);
    
    socket.on('load-in', function(data){  
        console.log(data.spots.color);
        alreadyDrawn = data.spots;
        console.log("first")
    });

    //draw the loaded spots
    setTimeout(function(){
        var spotLength = alreadyDrawn.length;
        console.log("second");
        for(var i = 0; i < spotLength; i++){
            drawSpot(alreadyDrawn[i].x, alreadyDrawn[i].y, alreadyDrawn[i].s, alreadyDrawn[i].color);
            // drawSpot(alreadyDrawn[i].x, alreadyDrawn[i].y, alreadyDrawn[i].s, alreadyDrawn[i].r, alreadyDrawn[i].g, alreadyDrawn[i].b);
        }
    }, 500);
        
    
    //Where other people's drawings are.
    socket.on('orbs', function(data){
        drawSpot(data.x, data.y, data.s, data.color);
        // drawSpot(data.x, data.y, data.s, data.r, data.g, data.b);
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
    // socket.emit('orbs', {x: mouseX, y: mouseY, s: size, r: r, g: g, b: b});
    socket.emit('orbs', {x: mouseX, y: mouseY, s: size, color: color});
    drawSpot(mouseX, mouseY, size, color);
    // drawSpot(mouseX, mouseY, size, r, g, b);
}
function mousePressed()
{
    //send the information
    // socket.emit('orbs', {x: mouseX, y: mouseY, s: size, r: r, g: g, b: b});
    // drawSpot(mouseX, mouseY, size, r, g, b);
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
green.onclick = function(){color = '#008000';}
// green.onclick = function(){r = 0;  g = 153;  b = 51;}

var blue = document.getElementById('blue');
blue.onclick = function(){color = '#0000ff';}

var purple = document.getElementById('purple');
purple.onclick = function(){color = '#800080';}

var black = document.getElementById('black');
black.onclick = function(){r = 0;  g = 0;  b = 0;}

var white = document.getElementById('white');
white.onclick = function(){r = 255;  g = 255;  b = 255;}

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

// function drawSpot(x, y, s, r, g, b)
// {
//     fill(r, g, b);
//     noStroke();
//     ellipse(x, y, s, s);
// }

function drawSpot(x, y, s, c)
{
    fill(c);
    noStroke();
    ellipse(x, y, s, s);
}
