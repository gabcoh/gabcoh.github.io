
var change = true;
var clicked = false;
var weight = 1;
var lines = 20;
var focus = {x:0,y:0};
var circleColor = '#aaaaaa';
//var tangentColor = '#bbbfff';
var pointWeight;

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

    background(255, 255, 255);
    strokeWeight(weight);
    stroke(0,0,0);
}

function draw() {
    if (change) {
        clear();
        push();
        stroke(color(circleColor));
        ellipse(WIDTH/2, HEIGHT/2, SMALL/4, SMALL/4); 
        strokeWeight(pointWeight);
        point(focus.x,focus.y);
        point(SMALL/2, SMALL/2);
        pop();

        strokeWeight(weight);
        //stroke(color(tangentColor));

        var epsilon = TWO_PI/lines;
        for(var rads = 0; rads < TWO_PI; rads+=epsilon){
            var x = SMALL/4*Math.cos(rads) + WIDTH/2;
            var y = SMALL/4*Math.sin(rads) + HEIGHT/2;


            var p = {x:(x+focus.x)/2, y:(y+focus.y)/2};
            var slope = -1*(focus.x - x)/(focus.y - y);

            var farLeftY = -1*slope*p.x + p.y; 
            var farRightY = slope*(WIDTH- p.x) + p.y;
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
