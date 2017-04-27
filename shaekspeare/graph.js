function Graph(mat, lab) {
    this.matrix = mat;
    this.labels = lab;

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
