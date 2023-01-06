// User functions
function show_create_node_modal(nodeType){
  $('#create-node-input').val('');
  $('#create-node-type').val(nodeType);
  $('#create-node-modal-type').html(nodeType);
  $('#create-node-modal').modal('show');
  $('#create-node-input').focus();
}

function add_node(){
  var nodeValue = $('#create-node-input').val();
  var nodeType = $('#create-node-type').val();
  var nodeObj = {
    data:{
      id:nodeValue,
      color:NodeType[nodeType]['color'],
      wants:"id",
    },
  }

  var node = new Node(nodeValue, NodeType[nodeType]);
  allNodes.push(node);

  graph.add(nodeObj);
  graph.center();
  $('#create-node-input').val('');
  $('#create-node-modal').modal('hide');

  graph.reset();

  graph.layout( graphLayoutOptions ).run();
  
  graph.center();

  logSuccess(' --------------- ' + nodeType + ' node created successfully ---------------')
}

function showNodeData(shownNode){
  $('#node-title').html(shownNode.title);
  $('#node-details').html(shownNode.getDetails());
  $('#view-modal').modal('show');
}

function deleteNode(deletedNode){
  var removeData = graph.$('node[id="'+deletedNode.title+'"]');

  graph.remove(removeData);

  for(let k = 0; k < allNodes.length; k++){
    if(allNodes[k].parent && allNodes[k].parent.title == deletedNode.title){
      allNodes[k].parent = null;
    }
  }

  var removeIndex = allNodes.indexOf(deletedNode);
  if (removeIndex !== -1) {
    allNodes.splice(removeIndex, 1);
  }

  graph.center();
  logWarning(' --------------- ' + deletedNode.type.name + ' node '+ deletedNode.title +' deleted successfully ---------------')
}

function focusAllNodes(){
  var foundNodes = [];
  for(let i = 0; i < Math.min(allNodes.length, 50); i++){
    var foundNode = graph.$('node[id="' + allNodes[i].title + '"]');
    
    if(foundNode && foundNode.length>0){
      foundNodes.push(allNodes[i]);
    }
  }

  focusedNodes = foundNodes;

  for(let i = 0; i < allNodes.length; i++){
    var foundNode = graph.$('node[id="' + allNodes[i].title+'"]');
    var defaultColor = allNodes[i].type['color'];
    foundNode.style({'background-color': defaultColor})
  }


  for(let i = 0; i < allNodes.length; i++){
    var foundNode = graph.$('node[id="' + allNodes[i].title + '"]');
    foundNode.select();
    var defaultColor = allNodes[i].type['color'];
    var rgbDefaultColor = hexToRgb(defaultColor);

    var changeVal = 40;

    rgbDefaultColor.r = clamp(rgbDefaultColor.r + changeVal, 0, 255);
    rgbDefaultColor.g = clamp(rgbDefaultColor.g + changeVal, 0, 255);
    rgbDefaultColor.b = clamp(rgbDefaultColor.b + changeVal, 0, 255);

    var highlightedColorHex = rgbToHex(rgbDefaultColor.r, rgbDefaultColor.g, rgbDefaultColor.b);

    foundNode.style({'background-color': highlightedColorHex});
  }
}

function prepareFocusedNodes(){
  var foundNodes = [];
  for(let i = 0; i < allNodes.length; i++){
    var foundNode = graph.$('node[id="' + allNodes[i].title + '"]:selected');
    
    if(foundNode && foundNode.length>0){
      foundNodes.push(allNodes[i]);
    }
  }

  focusedNodes = foundNodes;

  for(let i = 0; i < allNodes.length; i++){
    var foundNode = graph.$('node[id="' + allNodes[i].title+'"]');
    var defaultColor = allNodes[i].type['color'];
    foundNode.style({'background-color': defaultColor})
  }

  for(let i = 0; i < allNodes.length; i++){

    var foundNode = graph.$('node[id="' + allNodes[i].title + '"]:selected');
    var defaultColor = allNodes[i].type['color'];
    var rgbDefaultColor = hexToRgb(defaultColor);

    var changeVal = 40;

    rgbDefaultColor.r = clamp(rgbDefaultColor.r + changeVal, 0, 255);
    rgbDefaultColor.g = clamp(rgbDefaultColor.g + changeVal, 0, 255);
    rgbDefaultColor.b = clamp(rgbDefaultColor.b + changeVal, 0, 255);

    var highlightedColorHex = rgbToHex(rgbDefaultColor.r, rgbDefaultColor.g, rgbDefaultColor.b);

    foundNode.style({'background-color': highlightedColorHex})
  }

  checkFocused();
}

function copy_clipboard_nodes(){
  clipboardNodes = [];
  for(let i = 0; i < focusedNodes.length; i++){
    clipboardNodes.push(focusedNodes[i]);
  }

  logWarning(' --------------- Copied nodes to clipboard ---------------')

}

function paste_clipboard_nodes(){
  for(let i = 0; i < focusedNodes.length; i++){
    var node = Object.assign( {}, focusedNodes[i] );
    while(graph.$('node[id="' + node.title + '"]').length>0){
      node.title += ' - copy';
    }

    var nodeObj = {
      data:{
        id:node.title,
        color:node.type.color,
        wants:"id",
      },
    }

    allNodes.push(node);
  
    graph.add(nodeObj);
  
  }

  graph.center();
  graph.reset();

  graph.layout( graphLayoutOptions ).run();

  logSuccess(' --------------- Pasted nodes from clipboard ---------------')
}


function checkFocused(){
  let sameTypeNodes = true;
  let nodeType = null;

  showSelectedNodeProperties();

  $('#transforms-contents').empty();

  $('#focused-nodes-contents').empty();

  if(focusedNodes.length <= 0){
    $('#focused-nodes-contents').html(`
      <p class="text-light">No node selected</p>
    `);
  }

  for(let i = 0; i< focusedNodes.length; i++){
    if(nodeType != null && nodeType != focusedNodes[i].type.name){
      sameTypeNodes = false;
    }else{
      nodeType = focusedNodes[i].type.name;
    }

    $('#focused-nodes-contents').append(`
    <button data-node="${focusedNodes[i].title}" class="node w-100 text-light border" id="focused-node-${focusedNodes[i].title}">
      <p>
        <span class="bullet" style="color: ${focusedNodes[i].type.color};">&#9642;</span>
          <span class="text">
            ${focusedNodes[i].title}
          </span>
          <br/>
          <span class="text text-muted small ml-3">
            ${focusedNodes[i].type.name}
          </span>
      </p>
    </button>
    `);

    $('button[id="focused-node-' + focusedNodes[i].title + '"]').focus(function(e){
      showSelectedNodeProperties(focusedNodes[i]);
    });

    $('button[id="focused-node-' + focusedNodes[i].title + '"]').bind('blur', function(e){
      showSelectedNodeProperties();
    });
  }

  if(focusedNodes.length > 0 && sameTypeNodes){
    for(let i = 0; i < allNodeTransforms[nodeType].length; i++){
      $('#transforms-contents').append(`
      <div class="panel-group transform" id="${allNodeTransforms[nodeType][i].name}-menu-transform-full">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" href="#${allNodeTransforms[nodeType][i].name}-menu-transform">&#8982; ${allNodeTransforms[nodeType][i].name}</a>
              <span class="float-right transform-but text-success">&#9658;</span>
            </h4>
          </div>
          <div id="${allNodeTransforms[nodeType][i].name}-menu-transform" class="panel-collapse collapse border-top">
            <div class="panel-body">${allNodeTransforms[nodeType][i].description}</div>
          </div>
        </div>
      </div>
      `);

      $('#' + allNodeTransforms[nodeType][i].name + '-menu-transform-full .transform-but').click(function(){
        for(let j = 0; j < focusedNodes.length; j++){
          executeTransform(allNodeTransforms[nodeType][i].command, allNodeTransforms[nodeType][i], focusedNodes[j]);
        }

        checkFocused();
      });
    }
  }else{
    if(focusedNodes.length > 1 && !sameTypeNodes){
      $('#transforms-contents').html('<p class="text-light">Selected nodes are different types. Cannot be transformed at once.</p>')
    }else{
      $('#transforms-contents').html('<p class="text-light">No node selected.</p>')
    }
  }
}

// Data parser
function parseResultData(dataArr, selectedNode){
  for(let i = 0; i < dataArr.length; i++){
    var exists = false;
    for(let k = 0; k < allNodes.length; k++){
      if(allNodes[k].title == dataArr[i].name){
        exists = true;
      }
    }

    if(exists){
      continue;
    }

    var nodeType = ucfirst(dataArr[i].type);
    var nodeObj = {
      data:{
        id:dataArr[i].name,
        color:NodeType[nodeType]['color'],
        wants:"id",
      },
    }
    var node = new Node(dataArr[i].name, NodeType[nodeType]);
    node.parentNode = selectedNode;
    
    if(dataArr[i].hasOwnProperty('details')){
      node.setDetails(dataArr[i].details);
    }else{
      node.setDetails('none');
    }

    allNodes.push(node);
    graph.add(nodeObj);
    graph.add({
        data: { id: selectedNode.title+dataArr[i].name, source: selectedNode.title, target: dataArr[i].name }
    })
  }

  
  graph.layout( graphLayoutOptions ).run();
  graph.center();
}


// API
function executeTransform(transformCommand, transformObj, affectedNode){
  logWarning('Started  ' + transformObj['name'] + ' transform on ' + affectedNode.title + ' - ' + affectedNode.type.name)

  $.ajax(
    {
      url: 'backend/requests.php', 
      data: {
        modules: 'exec',
        module_name: transformCommand,
        SOURCE:affectedNode.title,
        limit:resultLimit
      },
      success: function(data){
        parseResultData(data, affectedNode);
        logSuccess('Successfully executed  ' + transformObj['name'] + ' transform on ' + affectedNode.title + ' - ' + affectedNode.type.name )
      },
      error: function(error){
        logError('An error occured executing  ' + transformObj['name'] + ' transform on ' + affectedNode.title + ' - ' + affectedNode.type.name )
      }
    });
}