var graph = null;
var tappedBefore;
var tappedTimeout;

$(document).ready(function(){
  // Graph Init
  graph = cytoscape({
      container: $('#graph-container'),

      elements: [ // list of graph elements to start with
          /*
          { // edge ab
              data: { id: 'ab', source: 'a', target: 'b' }
          }
          */
      ],

      style: [ // the stylesheet for the graph
          {
              selector: 'node',
              style: {
                  'background-color': 'data(color)',
                  'label': 'data(id)'
              }
          },

          {
              selector: 'edge',
              style: {
                  'width': 3,
                  'line-color': '#ccc',
                  'target-arrow-color': '#ccc',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier'
              }
          }
      ],

      layout: graphLayoutOptions,
  });

  graph.gridGuide(gridGuideOptions);

  graph.on('mouseover', 'node', function(event) {
      var node = event.target;
      for(let i = 0;  i < allNodes.length; i++){
        if(allNodes[i].title == node.data().id){
          selectedNode = allNodes[i];
          if($('.contextMenu').length<=0){
            var localMenu = nodeMenus[selectedNode.type['name']];
            myMenu.refreshItems(localMenu);
          }
          break;
        }
      }
      /*
      node.qtip({
           content: 'hello',
           show: {
              event: event.type,
              ready: true
           },
           hide: {
              event: 'mouseout unfocus'
           }
      }, event);
      */
  });

  graph.on('select unselect', 'node', function(e){
    prepareFocusedNodes();
  });

  graph.on('tap', function(e) {
    var tappedNow = e.target;
    if(e.target.group && e.target.group()=="nodes"){
      if(tappedNow){
        if (tappedTimeout && tappedBefore) {
          clearTimeout(tappedTimeout);
        }
        if(tappedBefore === tappedNow) {
          tappedNow.trigger('doubleTap');
          tappedBefore = null;
        } else {
          tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
          tappedBefore = tappedNow;
        }
      }
    }else{
      focusedNodes = [];
      for(let i = 0; i < allNodes.length; i++){
        var foundNode = graph.$('node[id="' + allNodes[i].title+'"]');
        var defaultColor = allNodes[i].type['color'];
        foundNode.style({'background-color': defaultColor})
      }
    }
  });

  graph.on('doubleTap', 'node', function(e) {
    if(e.target){
      for(let k = 0; k < allNodes.length; k++){
        if(allNodes[k].title == e.target.data().id){
          showNodeData(allNodes[k]);
          break;
        }
      }
    }
  });

  graph.on('mouseout', 'node', function(e) {

    var checkFunction = function(){
      if($('.contextMenu').length>0){
        setTimeout(checkFunction, 50);
      }else{
        selectedNode = null;
        myMenu.refreshItems(menuItems);
      }
    }
    setTimeout(checkFunction, 50);
  });

  checkFocused();
});
