
function Graph(mat, lab) {
    this.matrix = mat;
    this.labels = lab;

    this.isEdge = function isEdge(label1, label2) {
        return this.matrix[this.labels.indexOf(label1)][this.labels.indexOf(label2)] > 0;
    }
    this.getEdges = function() {
        var out = new Set();
        for(var i = 0; i<this.matrix.length; i++) {
            for(var j = 0; j<this.matrix[i].length; j++) {
                if(i == j || this.matrix[i][j] == 0) {
                    continue;
                }
                if(!(out.has([this.labels[i], this.labels[j]]) || out.has([this.labels[j] ,this.labels[i]]))) {
                    out.add([this.labels[i], this.labels[j]]); 
                }
            }
        }
        return out;
    }
    //Takes a dictionary of labels to numebers (colors)
    this.isValidColoring = function(coloring) {
        for(let e of this.getEdges()) {
            if(coloring[e[0]] == coloring[e[1]]) {
                return false;
            }
        }
        return true;
    }
}

function nameCase(name) {
    var unimportant = ["the", "of"];
    var words = name.split(' ');
    var post = words[0][0].toUpperCase() + words[0].slice(1).toLowerCase();
    for(var i = 1; i<words.length; i++) {
        if(words[i].toLowerCase() in unimportant) {
            post += " " + words[i].toLowerCase();
        } else {
            post += " " + words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
        }
    }
    return post;
}
function display(args, lines) {
    var outDiv = document.getElementById('output');
    outDiv.innerHTML = "";
    var table = document.createElement('table');
    table.setAttribute('border', 1);
    for(var actor = 0; actor<args.length; actor++) {
        var row = document.createElement('tr');
        var actorCell = document.createElement('td');
        actorCell.innerText = 'Actor ' + (actor + 1);
        row.appendChild(actorCell);
        var cell = document.createElement('td'); 
        cell.innerText = nameCase(args[actor][0]);
        for(var role = 1; role<args[actor].length; role++) {
            cell.innerText += ", " + nameCase(args[actor][role]);
        }
        row.appendChild(cell); 
        if (typeof lines !== 'undefined') {
            cell = document.createElement('td');
            cell.innerText = lines[actor] + ' lines';
            row.appendChild(cell); 
        }
        table.appendChild(row);
    }
    outDiv.appendChild(table);
}

function naive(numberOfActors) {
    return function(play) {
        var cast = Object.keys(play.CAST);
        var graph = new Graph(play.MATRIX, cast);
        var currentActor = 0;
        var roles = [];
        for(var i = 0; i<cast.length; i++) {
            if(typeof roles[currentActor] === 'undefined') {
                roles[currentActor] = [];
            }
            roles[currentActor].push(cast[i]);
            currentActor = (currentActor + 1) % numberOfActors;
        }
        display(roles);
    }
}
function slightlyBetter(numberOfActors) {
    return function(play) {
        var cast = Object.keys(play.CAST);
        var graph = new Graph(play.MATRIX, cast);
        //each index represents an actor
        //[["julius", "mark"], ["soothesayer"]] => Actor 1 julius and mark, Actor 2 soothesayer
        var roles = [];
        for(var i = 0; i< numberOfActors; i++) {
            roles.push([]);
        }
        var start = 0;
        //for every character in the play
        for (var i = 0; i<cast.length; i++) {
            var first = true;
            var potential = start;
            // while potential actor has a conflict with character at cast[i] 
            // increment potential and try next actor
            // if every one has conflict just give character to actor[start]
            while(roles[potential].some((a) => graph.isEdge(a, cast[i]))
                    && !(potential == start && !first)) {
                first = false;
                potential = (potential + 1) % numberOfActors;
            }
            roles[potential].push(cast[i]);
            // might not need % number of actors  
            start = (start + 1) % numberOfActors;
        }
        display(roles);
    }
}
function linesFair(numberOfActors) {
    return function(play) {
        var cast = Object.keys(play.CAST);
        var graph = new Graph(play.MATRIX, cast);
        var roles = [];
        var lines = [];
        for(var i = 0; i< numberOfActors; i++) {
            roles.push([]);
            lines.push(0);
        }
        var start = 0;
        for (var i = 0; i<cast.length; i++) {
            var first = true;
            var potentialActor = undefined;
            for(var j = 0; j<numberOfActors; j++) {
                if(roles[j].every((a) => !graph.isEdge(a, cast[i])) &&
                        (typeof potentialActor === "undefined" || lines[j] <= lines[potentialActor])) {
                    potentialActor = j; 
                }
            }
            if(typeof potentialActor === "undefined") {
                potentialActor = start;
            }
            roles[potentialActor].push(cast[i]);
            lines[potentialActor] += play.CAST[cast[i]];
            start = (start + 1) % numberOfActors;
        }
        display(roles, lines);
    }
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

function bruteForce(numberOfActors, play) {
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
    'Naive Assignment' : naive,
    'Slightly Less Naive' : slightlyBetter,
    'Slightly Less Naive and a Little Fairer' : linesFair
}


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

var plays = {
    'Antony and Cleopatra': 'a_and_c.json',
    'All\'s Well That Ends Well':'all_well.json',
    'As You Like it':'as_you.json',
    'A Comedy of Errors':'com_err.json',
    'Coriolanus':'coriolan.json',
    'Cymbeline':'cymbelin.json',
    'A Midsummer Night\'s Dream':'dream.json',
    'Hamlet':'hamlet.json',
    'Henry IV: Part 1':'hen_iv_1.json',
    'Henry IV: Part 2':'hen_iv_2.json',
    'Henry VI: Part 1':'hen_vi_1.json',
    'Henry VI: Part 2':'hen_vi_2.json',
    'Henry VI: Part 3':'hen_vi_3.json',
    'Henry VIII':'hen_viii.json',
    'Henry V':'hen_v.json',
    'Julius Caesar':'j_caesar.json',
    'King John':'john.json',
    'King Lear':'lear.json',
    'Love\'s Labour\'s Lost':'lll.json',
    'Macbeth':'macbeth.json',
    'Merchant of Venice':'merchant.json',
    'Measure for Measure':'m_for_m.json',
    'Much Ado about Nothing':'much_ado.json',
    'Merry Wives of Windsor':'m_wives.json',
    'Othello':'othello.json',
    'Pericles':'pericles.json',
    'Romeo and Juliet':'r_and_j.json',
    'Richard III':'rich_iii.json',
    'Richard II':'rich_ii.json',
    'Taming of the Shrew':'taming.json',
    'Tempest':'tempest.json',
    'Timon of Athens':'timon.json',
    'Titus Andronicus':'titus.json',
    'Twelfth Night':'t_night.json',
    'Trolius and Cressida':'troilus.json',
    'Two Gentlemen of Verona':'two_gent.json',
    'Winter\'s Tale':'win_tale.json',
}


var play_select = document.getElementById("play_select");
var assigner_select = document.getElementById("assigner_select");
var play_names = Object.keys(plays); 
var assigner_names = Object.keys(registered_assigners); 
for(var i = 0; i<play_names.length || i<assigner_names.length; i++) {
    if(i < play_names.length) {
        var play_node = document.createElement("option");
        play_node.value = play_names[i];
        play_node.innerHTML = play_names[i];
        play_select.appendChild(play_node);
    }
    if(i < assigner_names.length) {
        var assigner_node = document.createElement("option");
        assigner_node.value = assigner_names[i];
        assigner_node.innerHTML = assigner_names[i];
        assigner_select.appendChild(assigner_node);
    }
}
function runAssignment() {
    var play = plays[document.getElementById("play_select").value];
    var assigner = registered_assigners[document.getElementById("assigner_select").value];
    var actors = document.getElementById("actors").value;
    fetchJSONFile("./matrix3/"+play).then(assigner(actors), function(err) {
        console.log("err gabe" + err);   
    });
}

document.getElementById("submit").onclick = runAssignment;
