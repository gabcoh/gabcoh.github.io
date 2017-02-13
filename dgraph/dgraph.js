
var HEIGHT, WIDTH, SMALL;
var canvasDiv, formulaIn, showAxes, graphType, minX, minY, maxX, maxY;
var f = function(x) {
    return Math.sin(x);
}
var change = true;

var gWindow = { 
    minX : -10,
    minY : -10,
    maxX : 10,
    maxY : 10,
    deltaX : 1,
    deltaY : 1,
    minTheta : -6.28,
    maxTheta : 6.28,
    minR : -5, 
    maxR : 5,
    deltaTheta : 0.01,
    deltaR : 1,
    axes : true,
    graphType: 'cartesian',
    ind : 'x'
};

function setup() {
    canvasDiv = document.getElementById('canvas');
    HEIGHT = canvasDiv.clientHeight;
    WIDTH = canvasDiv.clientWidth;
    SMALL = Math.min(HEIGHT, WIDTH);

    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('canvas');

    formulaIn = createInput();
    formulaIn.style('bottom', '0');
    formulaIn.style('background-color', '#222222');
    formulaIn.style('height', '5%');
    formulaIn.style('width', '10%');
    formulaIn.style('color', '#ffffff');
    formulaIn.value('sin(x)');
    formulaIn.elt.addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
            clearErr();
            parseFormula();
        }
    });
    
    showAxes = createButton('axes');
    showAxes.style('bottom', '5%');
    showAxes.style('left', '10%');
    showAxes.style('height', '5%');
    showAxes.style('width', '5%');
    showAxes.style('background', '#dddddd');
    showAxes.mousePressed(function() {
        change = true;
        gWindow.axes = !gWindow.axes;
        clearErr();
    });
    minX = createInput('-10'); 
    minX.class('gWindow');
    minY = createInput('-10');
    minY.class('gWindow');
    maxX = createInput('10');
    maxX.class('gWindow');
    maxY = createInput('10');
    maxY.class('gWindow');
    minX.style('bottom', '5%');
    minX.style('left', '5%');
    minY.style('bottom', '0%');
    minY.style('left', '10%');
    maxX.style('bottom', '5%');
    maxX.style('left', '15%');
    maxY.style('bottom', '10%');
    maxY.style('left', '10%');
    minX.elt.addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
            gWindow.minX = parseInt(minX.value());
            gWindow.minTheta = parseInt(minX.value());
            change = true;
        }
    });
    minY.elt.addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
            gWindow.minY = parseInt(minY.value());
            gWindow.minR = parseInt(minY.value());
            change = true;
        }
    });
    maxX.elt.addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
            gWindow.maxX = parseInt(maxX.value());
            gWindow.maxTheta = parseInt(maxX.value());
            change = true;
        }
    });
    maxY.elt.addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
            gWindow.maxY = parseInt(maxY.value());
            gWindow.maxR = parseInt(maxY.value());
            change = true;
        }
    });

    graphType = createButton('polar');
    graphType.style('bottom', '5%');
    graphType.style('left', '0%');
    graphType.style('height', '5%');
    graphType.style('width', '5%');
    graphType.style('background', '#eeeeee');
    graphType.mousePressed(function(){
        if(gWindow.graphType === 'cartesian') {
            graphType.html('cartesian');
            gWindow.graphType = 'polar';
            minX.value(gWindow.minTheta);
            minY.value(gWindow.minR);
            maxX.value(gWindow.maxTheta);
            maxY.value(gWindow.maxR);
        } else {
            graphType.html('polar');
            gWindow.graphType = 'cartesian';
            minX.value(gWindow.minX);
            minY.value(gWindow.minY);
            maxX.value(gWindow.maxX);
            maxY.value(gWindow.maxY);
        }
        change = true;
    });
}

function draw() {
    if(change) {
        clear();
        push();
        if(gWindow.graphType === 'cartesian') {
            stroke(255);
            strokeWeight(4)
            background(0);
            var last = f(0);
            for(var px = 0; px<WIDTH; px++) {
                var x = map(px, 0, WIDTH, gWindow.minX, gWindow.maxX);
                var y = f(x);
                var py = map(y, gWindow.minY, gWindow.maxY, HEIGHT, 0);
                point(px, py);
            }
        
            pop();
            if(gWindow.axes) {
                stroke(200, 200, 200, 200);
                strokeWeight(2);
                line(WIDTH/2, 0, WIDTH/2, HEIGHT);
                line(0, HEIGHT/2, WIDTH, HEIGHT/2);
                for(var i = gWindow.minX; i<gWindow.maxX; i+=gWindow.deltaX) {
                    px = map(i, gWindow.minX, gWindow.maxX, 0, WIDTH);
                    line(px, HEIGHT/2 - (HEIGHT*.01), px, HEIGHT/2 + (HEIGHT*.01));
                }
                for(var i = gWindow.minY; i<gWindow.maxY; i+=gWindow.deltaY) {
                    py = map(i, gWindow.minY, gWindow.maxY, 0, WIDTH);
                    line(WIDTH/2 - (WIDTH*.01), py, WIDTH/2 + (WIDTH*.01), py);
                }
            }
        } else if (gWindow.graphType === 'polar') {
            stroke(255);
            strokeWeight(4)
            background(0);
            for(var theta = gWindow.minTheta; theta<gWindow.maxTheta; theta+=gWindow.deltaTheta) {
                var r = f(theta) * gWindow.maxR*SMALL/2;
                var px = r*Math.cos(theta) + WIDTH/2;
                var py = r*Math.sin(theta) + HEIGHT/4;
                point(px, py);
            }
        }
        change = false;
    }
}

var functions = {
    '+' : {
        fix : 'in',
        type : 'op',
        assoc : 'left',
        prec : 5,
        func : (a, b) => a + b,
        args : 2
    },
    '-' : {
        fix : 'in',
        type : 'op',
        assoc : 'left',
        prec : 4,
        func : (a, b) => a - b,
        args : 2
    },
    '*' : {
        fix : 'in',
        type : 'op',
        assoc : 'left',
        prec : 5,
        func : (a, b) => a * b,
        args : 2
    },
    '/' : {
        fix : 'in',
        type : 'op',
        assoc : 'left',
        prec : 4,
        func : (a, b) => a / b,
        args : 2
    },
    '^' : {
        fix : 'in',
        type : 'op',
        assoc : 'right',
        prec : 6,
        func : (a, b) => Math.pow(a, b),
        args : 2
    },
    'sin' : {
        type : 'func',
        func : (a) => Math.sin(a),
        args : 1
    },
    'csc' : {
        type : 'func',
        func : (a) => 1/Math.sin(a),
        args : 1
    },
    'cos' : {
        type : 'func',
        func : (a) => Math.cos(a),
        args : 1
    },
    'sec' : {
        type : 'func',
        func : (a) => 1/Math.cos(a),
        args : 1
    },
    'tan' : {
        type : 'func',
        func : (a) => Math.tan(a),
        args : 1
    },
    'cot' : {
        type : 'func',
        func : (a) => 1/Math.tan(a),
        args : 1
    },
    'sqrt' : {
        type : 'func',
        func : (a) => Math.sqrt(a),
        args : 1
    },
    'ln' : {
        type : 'func',
        func : (a) => Math.log(a),
        args : 1
    },
    'log' : {
        type : 'func',
        func : (a) => Math.log10(a),
        args : 1
    },
    'logb' : {
        type : 'func',
        func : (a, b) => Math.log(a)/Math.log(b),
        args : 2
    },
    'floor' : {
        type : 'func',
        func : (a) => Math.floor(a),
        args : 1
    },
    'ceil' : {
        type : 'func',
        func : (a) => Math.ceil(a),
        args : 1
    }
};
var constants = {
    'e' : 2.71828,
    'pi' : 3.14156,
    'tau' : 6.28318
}
function parseFormula() {
    //var tokenizer = /([a-zA-Z]+)[()]*|[^,\s]+([\-+*\^])/g;
    var tokenizer = /[0-9]*\.{0,1}[0-9]+|[\-+*/\^(),]|[A-Za-z]+/g;
    var input = formulaIn.value();
    var tokens = [];

    var match = tokenizer.exec(input);
    while(match != null) {
        tokens.push(match[0]);
        match = tokenizer.exec(input);
    }
    //console.log(tokens);
    var opStack = [];
    var polish = [];
    for(var i = 0; i< tokens.length; i++) {
        if(/^[0-9]/.test(tokens[i])) {
            polish.push(parseInt(tokens[i]));
        } else if(/\.[0-9]/.test(tokens[i])) {
            polish.push(parseFloat(tokens[i]));
        } else if (tokens[i] in functions && functions[tokens[i]].type === 'func') {
            opStack.push(functions[tokens[i]]);
        } else if (tokens[i] === ',') {
            while(opStack[opStack.length -1] !== '(') {
                polish.push(opStack.pop());
            }
            if(opStack.length == 0) {
                console.log('seperator misplaced or mismatched parens');
                expErr();
            }
        } else if (tokens[i] in functions && functions[tokens[i]].type === 'op') {
            var o1 = functions[tokens[i]];
            while(  !unDef(opStack[opStack.length -1]) && 
                    opStack[opStack.length -1].type === 'op' &&
                    ((o1.assoc === 'left' && o1.prec <= opStack[opStack.length -1].prec) || 
                    (o1.assoc === 'right' && o1.prec < opStack[opStack.length -1].prec)))
            {
                polish.push(opStack.pop());
            }
            opStack.push(o1);
        } else if (tokens[i] === '(') {
            opStack.push(tokens[i]);
        } else if (tokens[i] === ')') {
            while(opStack[opStack.length -1] !== '(') {
                polish.push(opStack.pop());
            }
            opStack.pop();
            if (!unDef(opStack[opStack.length - 1]) &&
                opStack[opStack.length -1].type === 'func') {
                polish.push(opStack.pop());
            } else if (opStack.length === 0) {
                console.log('mismatched paren');
                expErr();
            }
        } else if (tokens[i] === gWindow.ind) {
            polish.push(tokens[i]);
        } else if (tokens[i] in constants) {
            polish.push(constants[tokens[i]]);    
        }else {
            console.log('wat');
            expErr();
        }
    }
    while(opStack.length !== 0) {
        if(opStack[opStack.length -1] === '(' || opStack[opStack.length -1] === ')') {
            console.log('mismatched paren');
            expErr();
        } else {
            polish.push(opStack.pop());
        }
    }
    console.log(polish);
    f = polishProcessor(polish);
    change = true;
}
function polishProcessor(polish) {
    return function(x) { 
        var args = [];
        for(var i = 0; i<polish.length; i++) {
            var f = polish[i];
            if(f.type === 'func' || f.type === 'op') {
                if (args.length < f.args) {
                    console.log('not enough arguments');
                    expErr();
                } else {
                    var re = f.func(...args.slice(args.length - f.args, args.length));
                    for(var j = 0; j<f.args; j++) {
                        args.pop();
                    }
                    args.push(re);
                }
            } else if (f === gWindow.ind){
                args.push(x);
            } else if (typeof f === 'number'){
                args.push(f);
            } else {
                console.log('wat');
                expErr();
            }
        }
        if (args.length !== 1) {
            console.log('expression error');
            expErr();
        }
        return args.shift();
    }
}

function expErr() {
    formulaIn.style('background-color', '#dd1111');
}
function clearErr() {
    formulaIn.style('background-color', '#222222');
}
function unDef(x) { 
    return typeof x == 'undefined';
}
