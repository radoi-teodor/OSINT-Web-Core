let holdNode = null;

$('#request-ai-but').click(function(){
    let instructions = $('#ai-textarea').val().trim();
    if(instructions==''){
        logWarning('Prompt textbox is empty.');
        return;
    }

    if(focusedNodes.length <= 0){
        logWarning('No focused nodes. No context given, cannot complete instruction.');
        return;
    }
    holdNode = focusedNodes[focusedNodes.length - 1];
    $('#ai-textarea').val('');
    logWarning('Processing your instructions...');
    $.ajax({
        type: 'POST',
        url: 'backend/ai.php', 
        data: {
            instructions: instructions,
            nodes: JSON.stringify(focusedNodes)
        },
        success: function(data){
            let result = data;

            let nodeTitle = instructions + " " + generateId();

            var nodeObj = {
              data:{
                id:nodeTitle,
                color:NodeType['Information']['color'],
                wants:"id",
              },
            }
            
            var node = new Node(nodeTitle, NodeType['Information']);
            node.setDetails(result.result);
            node.parentNode = holdNode;
            allNodes.push(node);
            
            graph.add(nodeObj);

            if(node.parentNode){
                graph.add({
                data: { id: node.parentNode.title+node.title, source: node.parentNode.title, target: node.title }
                });
            }
            graph.center();
            graph.layout( graphLayoutOptions ).run();

            logSuccess('Successfully executed your instructions');
        },
        error: function(error){
            logError('An error occured')
        }
    });
});