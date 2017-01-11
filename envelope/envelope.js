
var change = true;
var weight = 1;
var lines = 20;
var focus = {x:0,y:0};
var circleColor = '#aaaaaa';
var pointWeight;

var DIMENSION;
var canvasDiv;

function setup() {
    canvasDiv = document.getElementById('canvas');
    DIMENSION = Math.min(canvasDiv.clientHeight, canvasDiv.clientWidth);

    var canvas = createCanvas(DIMENSION, DIMENSION);
    canvas.parent('canvas');
    canvas.mousePressed(canvasMousePressed);

    background(255, 255, 255);
    strokeWeight(weight);
    stroke(0,0,0);
}

function draw() {
    if (change) {
        clear();
        push();
        stroke(color(circleColor));
        ellipse(DIMENSION/2, DIMENSION/2, DIMENSION/4, DIMENSION/4); 
        strokeWeight(pointWeight);
        point(focus.x,focus.y);
        point(DIMENSION/2, DIMENSION/2);
        pop();

        strokeWeight(weight);
        var epsilon = TWO_PI/lines;
        for(var rads = 0; rads < TWO_PI; rads+=epsilon){
            var x = DIMENSION/4*Math.cos(rads) + DIMENSION/2;
            var y = DIMENSION/4*Math.sin(rads) + DIMENSION/2;


            var p = {x:(x+focus.x)/2, y:(y+focus.y)/2};
            var slope = -1*(focus.x - x)/(focus.y - y);

            var farLeftY = -1*slope*p.x + p.y; 
            var farRightY = slope*(DIMENSION - p.x) + p.y;
            line(0, farLeftY, DIMENSION, farRightY);
        }
        change = false;
    } 
}

function canvasMousePressed() {
    focus = {x:mouseX, y:mouseY};
    change = true;
}
