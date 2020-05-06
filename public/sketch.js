//p5.disableFriendlyErrors = true; // disables FES
var socket = io.connect('https://hills-connection.herokuapp.com/');
// var socket = io.connect('localhost:3000');
var size;
var color;
var r, g, b;
var alreadyDrawn = [];
var container = document.getElementById('sketch');
var cWidth = container.clientWidth;
var cHeight = container.clientHeight;

window.onload = function(){
    socket.emit('load-in');
    console.log("sending");
}

function setup() {
    // alert(cWidth + " x " + cHeight);
    //width: 1462     height: 931
    var canvas =  createCanvas(1462, 928);
    canvas.parent('sketch');
    frameRate(10);
    size = 15;
    r = 255;
    g = 0;
    b = 0;
    color = rgbToHex(r, g, b);
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
    
    //let the server know that a client has joined
    socket.emit('iJoined');
    socket.on('personJoin', function(data){
        console.log(data.joined + " has joined");
        console.log("People Online: " + data.everyone.length);
        document.getElementById('peopleCount').innerText = "People Online: " + data.everyone.length;
    })
    
    //a person has left
    socket.on('personLeft', function(data){
        console.log(data.left + " has left") 
        console.log("People Online: " + data.remaining.length);
        document.getElementById('peopleCount').innerText = "People Online: " + data.remaining.length;
    });
    valuesEqualize();
    
    
}
function draw(){
}

function mouseDragged()
{
    //send the information
    if(mouseX >= 0){
        socket.emit('orbs', {x: mouseX, y: mouseY, s: size, color: color});
        drawSpot(mouseX, mouseY, size, color);
    }
        
}
function mousePressed()
{
    //send the information
    if(mouseX >= 0){
        socket.emit('orbs', {x: mouseX, y: mouseY, s: size, color: color});
        drawSpot(mouseX, mouseY, size, color);
    }
}

//delete the screen
var deleteButton = document.getElementById("deleteButton");
deleteButton.onclick = function(){
    socket.emit('delete', x = 1);
}


//Change Color Buttons
var red = document.getElementById('red');
red.onclick = function(){changeColor(255,0,0);}

var orange = document.getElementById('orange');
orange.onclick = function(){changeColor(255,116,23);}

var yellow = document.getElementById('yellow');
yellow.onclick = function(){changeColor(255,255,0);}

var green = document.getElementById('green');
green.onclick = function(){changeColor(0,128,0);}

var blue = document.getElementById('blue');
blue.onclick = function(){changeColor(0,0,255);}

var purple = document.getElementById('purple');
purple.onclick = function(){changeColor(128,0,128);}

var pink = document.getElementById('pink');
pink.onclick = function(){changeColor(255,105,180);}

var black = document.getElementById('black');
black.onclick = function(){changeColor(0,0,0);}

var white = document.getElementById('white');
white.onclick = function(){changeColor(255,255,255);}

// var customChooser = document.getElementById('chooser');
// var custom = document.getElementById('custom');
// custom.onclick = function(){
//     custom.style.background = customChooser.value;
//     color = customChooser.value;
// }

//Bigger and Smaller brush size buttons
var sizeSlide = document.getElementById("sizeSlide");
var sizeInput = document.getElementById("sizeInput");
var redSlide = document.getElementById("redSlide");
var redInput = document.getElementById("redInput");
var greenSlide = document.getElementById("greenSlide");
var greenInput = document.getElementById("greenInput");
var blueSlide = document.getElementById("blueSlide");
var blueInput = document.getElementById("blueInput");
// var previewColor = document.getElementById("previewColor");

var prevCol = document.getElementById("prevCol");
var ctx = prevCol.getContext("2d");




sizeSlide.addEventListener('input', sliderEqualize);
sizeInput.addEventListener('input', InputEqualize);
redSlide.addEventListener('input', sliderEqualize);
redInput.addEventListener('input', InputEqualize);
greenSlide.addEventListener('input', sliderEqualize);
greenInput.addEventListener('input', InputEqualize);
blueSlide.addEventListener('input', sliderEqualize);
blueInput.addEventListener('input', InputEqualize);


function valuesEqualize(){
    size = int(sizeInput.value);
    r = int(redInput.value);
    g = int(greenInput.value);
    b = int(blueInput.value);
    color = rgbToHex(r,g,b);
    updatePrevCol();
}

function sliderEqualize(){
    sizeInput.value = sizeSlide.value;
    redInput.value = redSlide.value;
    greenInput.value = greenSlide.value;
    blueInput.value = blueSlide.value;
    valuesEqualize();
}

function InputEqualize(){
    sizeSlide.value = sizeInput.value;  
    redSlide.value = redInput.value;    
    greenSlide.value = greenInput.value;
    blueSlide.value = blueInput.value;
    valuesEqualize();
}

function changeColor(rr,gg,bb){
    r = rr;
    g = gg;
    b = bb;
    redInput.value = r;
    greenInput.value = g;
    blueInput.value = b;
    InputEqualize();
}

// //window resize
// window.onresize = function(){
//     console.log("changing window size");
//     container = document.getElementById('sketch');
//     cWidth = container.clientWidth;
//     cHeight = container.clientHeight;
//     resizeCanvas(cWidth,cHeight);
//     background(51);
// }

//HELPER FUNCTIONS
function drawSpot(x, y, s, c)
{
    fill(c);
    noStroke();
    ellipse(x, y, s);
}

function rgbToHex(r, g, b)
{
    return  '#' + rgbToHexHelper(r) + rgbToHexHelper(g) + rgbToHexHelper(b);
}

function rgbToHexHelper(rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
};

function updatePrevCol()
{
    ctx.clearRect(0, 0, prevCol.width, prevCol.height)
    ctx.beginPath();
    ctx.fillStyle = color;
    if(r > 220 && g > 220 && b > 220)
        ctx.strokeStyle = "#000000";
    else
        ctx.strokeStyle = "#FFFFFF";
    ctx.strokeSize = 1;
    ctx.arc(prevCol.width/2, prevCol.height/2, size/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
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

