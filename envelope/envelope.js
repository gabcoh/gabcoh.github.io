
var change = true;
var clicked = false;
var focus = {x:0,y:0};


var pwSlider, lineSlider;
var CIRCLE_COLOR = 200,
    POINT_COLOR = 200,
    LINE_WEIGHT = 1;

var HEIGHT, WIDTH, SMALL;
var canvasDiv;

function setup() {
    canvasDiv = document.getElementById('canvas');
    HEIGHT = canvasDiv.clientHeight;
    WIDTH = canvasDiv.clientWidth;
    SMALL = Math.min(HEIGHT, WIDTH);

    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('canvas');
    canvas.mousePressed(canvasMousePressed);
    canvas.mouseMoved(canvasMouseDragged);
   
    pwSlider = createSlider(0, 10, 1);
    pwSlider.position(10,30);
    pwSlider.style('width',WIDTH/4+'px');
    lineSlider = createSlider(1, 100, 10);
    lineSlider.position(10,70);
    lineSlider.style('width',WIDTH/4+'px');
    
    pwSlider.input(function() {
        change = true;
    });
    lineSlider.input(function() {
        change = true;
    });

    background(255, 255, 255);
    textSize(15)
}

function draw() {

    if (change) {
        clear();

        text("point weight", 5, 20);
        text("number of tangents", 5, 60);
        
        push();
        stroke(CIRCLE_COLOR);
        ellipse(WIDTH/2, HEIGHT/2, SMALL/4, SMALL/4); 
        strokeWeight(pwSlider.value());
        stroke(POINT_COLOR);
        point(focus.x,focus.y);
        point(WIDTH/2, HEIGHT/2);
        pop();

        strokeWeight(LINE_WEIGHT);
        var epsilon = TWO_PI/lineSlider.value();
        for(var rads = 0; rads < TWO_PI; rads+=epsilon){
            var x = SMALL/4*Math.cos(rads) + WIDTH/2;
            var y = SMALL/4*Math.sin(rads) + HEIGHT/2;


            var p = {x:(x+focus.x)/2, y:(y+focus.y)/2};
            var slope = -1*(focus.x - x)/(focus.y - y);

            var farLeftY = slope*(0 - p.x) + p.y; 
            var farRightY = slope*(WIDTH - p.x) + p.y;
            line(0, farLeftY, WIDTH, farRightY);
        }
        change = false;
    } 
}

function canvasMousePressed() {
    clicked = true;
    focus = {x:mouseX, y:mouseY};
    change = true;
}

function mouseReleased() {
    clicked = false;
}

function canvasMouseDragged() {
    if (clicked) {
        canvasMousePressed();
    }
}
