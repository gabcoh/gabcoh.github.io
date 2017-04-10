
var numberOfActors = 15;

var node;
function display(args) {
    var outDiv = document.getElementById('output');
    console.log('hi');
    outDiv.innerHTML = args;
}

function naive(play) {
    var graph = new Graph(play.MATRIX, play.CAST);
    console.log(graph.getEdges());
    var currentActor = 0;
    var roles = [];
    for(var i = 0; i<play.CAST.length; i++) {
        if(typeof roles[currentActor] === 'undefined') {
            roles[currentActor] = [];
        }
        roles[currentActor].push(play.CAST[i]);
        currentActor = (currentActor + 1) % numberOfActors;
    }
    for(var i = 0; i< roles.length; i++) {
        console.log(i + " " + roles[i]);
    }
    display(roles);
}

//Heap's algorithm
function* unfairColorings(nodes) {
    var A = [];
    var c = []; 
    for(var i = 0; i<nodes; i++) {
        c.push(0);
        A.push(i);
    }
    yield A;
    var i = 0;
    while(i < nodes) {
        if(c[i] < i) {
            var g;
            if((i % 2) == 0) {
                g = 0;
            } 
            else {
                g = c[i];
            }
            var temp = A[g];
            A[g] = A[i];
            A[i] = temp;
            yield A;
            c[i] += 1;
            i = 0;
        }
        else {
            c[i] = 0;
            i+= 1;
        }
    }
}

function bruteForce(play) {
    var graph = new Graph(play.MATRIX, play.CAST);
    var i = 0;
    for (var coloring of unfairColorings(graph.labels.length)) {
        var dict = coloring.reduce(function(a, e, i) {
            a[graph.labels[i]] = i % numberOfActors;
            return a;
        }, {});
        break;
    }
}

var registered_assigners = {
    'Naive Assignment' : naive
}

fetchJSONFile('matrix/dream.json').then(bruteForce, function(err) {
    console.log("err gabe" + err);   
});


//Gets JSON file from server (courtesy of stack overflow)
function fetchJSONFile(path) {
    return new Promise(function(success, failure) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (success) success(data);
                }
            }
        };
        httpRequest.error = failure;
        httpRequest.open('GET', path);
        httpRequest.send(); 
    });
};
