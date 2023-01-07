var ctrlPressed = false;

function centerGraph(){
    graph.reset();
    graph.center();
}

function layoutGraph(){
    graph.layout( graphLayoutOptions ).run();
}

$(document).keydown(function(e) {
    if($('.modal-backdrop.show').length > 0 || $('#ai-textarea').is(":focus")){
        return true;
    }
    switch(e.which){
        case 46: // DELETE KEY
            for(let i = 0; i < focusedNodes.length; i++){
                deleteNode(focusedNodes[i]);
            }
            prepareFocusedNodes();
            break;
        case 70: // F KEY
            centerGraph();
            break;
        case 65: // A KEY
            if(ctrlPressed){
                focusAllNodes();
                return false;
            }else{
                layoutGraph();
            }
            break;
        case 67: // C KEY
            if(ctrlPressed){
                copy_clipboard_nodes();
                return false;
            }
            break;
        case 86: // V KEY
            if(ctrlPressed){
                paste_clipboard_nodes();
                return false;
            }
            break;
        case 17:
            ctrlPressed = true;
            break;
        default:
            //console.log(e.which);
            break;
    }
});

$(document).keyup(function(e) {
    switch(e.which){
        case 17:
            ctrlPressed = false;
            break;
        default:
            //console.log(e.which);
            break;
    }
});
