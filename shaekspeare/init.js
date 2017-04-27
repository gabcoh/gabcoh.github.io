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
}
