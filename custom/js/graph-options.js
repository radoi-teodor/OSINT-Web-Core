// LAYOUT
// All layouts
let allLayoutsOptions = {
  'Random': {
    img: 'Random.png',
    options: {
      name: 'random',
      fit: true, // whether to fit to viewport
      padding: 30, // fit padding
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
    }
  },
  'Grid': {
    img: 'Grid.png',
    options: {
      name: 'grid',
      fit: true, // whether to fit the viewport to the graph
      padding: 30, // padding used on fit
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      condense: false, // uses all available space on false, uses minimal space on true
      rows: undefined, // force num of rows in the grid
      cols: undefined, // force num of columns in the grid
      position: function( node ){}, // returns { row, col } for element
      sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
    }
  },
  'Circle': {
      img: 'Circle.png',
      options: {
        name: 'circle',
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // the padding on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        radius: undefined, // the radius of the circle
        startAngle: 3 / 2 * Math.PI, // where nodes start in radians
        sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts     }
    }
  },
  'Concentric': {
      img: 'Concentric.png',
      options: {
        name: 'concentric',
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // the padding on fit
        startAngle: 3 / 2 * Math.PI, // where nodes start in radians
        sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
        equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
        minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        height: undefined, // height of layout area (overrides container height)
        width: undefined, // width of layout area (overrides container width)
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
          return node.degree();
        },
        levelWidth: function( nodes ){ // the variation of concentric values in each level
          return nodes.maxDegree() / 4;
        },
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    },
  },
  'Breadthfirst': {
      img: 'Breadthfirst.png',
      options: {
          name: 'breadthfirst',

          fit: true, // whether to fit the viewport to the graph
          directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
          padding: 30, // padding on fit
          circle: false, // put depths in concentric circles if true, put depths top down if false
          grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
          spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
          boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
          avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
          nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
          roots: undefined, // the roots of the trees
          maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
          depthSort: undefined, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
          animate: false, // whether to transition the node positions
          animationDuration: 500, // duration of animation in ms if enabled
          animationEasing: undefined, // easing of animation if enabled,
          animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
          ready: undefined, // callback on layoutready
          stop: undefined, // callback on layoutstop
          transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts    },
    },
  },
};

let graphLayoutOptions = allLayoutsOptions['Concentric']['options'];

var drawGrid = true;
var snapToGrid = true;
var interactiveGrid = true;
var gridSpacing = 40;
var gridLineWidth = 1.0;
var gridColor = '#dedede';
var colorPicker = null;

// GRID GUIDE
var gridGuideOptions = {
  /* From the following four snap options, at most one should be true at a given time */
  // Should be optional
  snapToGridOnRelease: snapToGrid, // Snap to grid on release
  snapToGridDuringDrag: snapToGrid, // Snap to grid during drag
  snapToAlignmentLocationOnRelease: false, // Snap to alignment location on release
  snapToAlignmentLocationDuringDrag: false, // Snap to alignment location during drag
  distributionGuidelines: false, // Distribution guidelines
  geometricGuideline: false, // Geometric guidelines
  initPosAlignment: false, // Guideline to initial mouse position
  centerToEdgeAlignment: false, // Center to edge alignment
  resize: false, // Adjust node sizes to cell sizes
  parentPadding: false, // Adjust parent sizes to cell sizes by padding
  // Should be optional
  drawGrid: drawGrid, // Draw grid background

  // General
  // Should be optional
  gridSpacing: gridSpacing, // Distance between the lines of the grid.
  snapToGridCenter: false, // Snaps nodes to center of gridlines. When false, snaps to gridlines themselves. Note that either snapToGridOnRelease or snapToGridDuringDrag must be true.

  // Draw Grid
  zoomDash: true, // Determines whether the size of the dashes should change when the drawing is zoomed in and out if grid is drawn.
  // Should be optional
  panGrid: interactiveGrid, // Determines whether the grid should move then the user moves the graph if grid is drawn.
  gridStackOrder: -1, // Namely z-index
  gridColor: gridColor, // Color of grid lines
  // Should be Optional
  lineWidth: gridLineWidth, // Width of grid lines

  guidelinesStackOrder: 4, // z-index of guidelines
  guidelinesTolerance: 2.00, // Tolerance distance for rendered positions of nodes' interaction.
  guidelinesStyle: { // Set ctx properties of line. Properties are here:
      strokeStyle: "#8b7d6b", // color of geometric guidelines
      geometricGuidelineRange: 400, // range of geometric guidelines
      range: 100, // max range of distribution guidelines
      minDistRange: 10, // min range for distribution guidelines
      distGuidelineOffset: 10, // shift amount of distribution guidelines
      horizontalDistColor: "#ff0000", // color of horizontal distribution alignment
      verticalDistColor: "#00ff00", // color of vertical distribution alignment
      initPosAlignmentColor: "#0000ff", // color of alignment to initial mouse location
      lineDash: [0, 0], // line style of geometric guidelines
      horizontalDistLine: [0, 0], // line style of horizontal distribution guidelines
      verticalDistLine: [0, 0], // line style of vertical distribution guidelines
      initPosAlignmentLine: [0, 0], // line style of alignment to initial mouse position
  },
  parentSpacing: -1 // -1 to set paddings of parents to gridSpacing
};

function change_grid_config(){
  drawGrid = $('#show-grid').is(':checked');
  snapToGrid = $('#snap-grid').is(':checked');
  interactiveGrid = $('#interactive-grid').is(':checked');
  gridSpacing = $('#grid-spacing').val();
  gridLineWidth = $('#grid-line-width').val();

  gridGuideOptions.snapToGridOnRelease = snapToGrid;
  gridGuideOptions.snapToGridDuringDrag = snapToGrid;
  gridGuideOptions.drawGrid = drawGrid;
  gridGuideOptions.panGrid = interactiveGrid;
  gridGuideOptions.gridColor = gridColor;
  gridGuideOptions.lineWidth = gridLineWidth;
  gridGuideOptions.gridSpacing = gridSpacing;

  if(graph){
    graph.gridGuide(gridGuideOptions);
  }else{
    var checkFunction = function(){
      if(graph){
        graph.gridGuide(gridGuideOptions);
      }else{
        setTimeout(checkFunction, 50);
      }
    }
    setTimeout(checkFunction, 50);
  }
}

function update_grid_config_ui(){
  if(drawGrid){
    $('#show-grid').attr('checked', 'checked');
  }else{
    $('#show-grid').removeAttr('checked');
  }

  if(snapToGrid){
    $('#snap-grid').attr('checked', 'checked');
  }else{
    $('#snap-grid').removeAttr('checked');
  }

  if(interactiveGrid){
    $('#interactive-grid').attr('checked', 'checked');
  }else{
    $('#interactive-grid').removeAttr('checked');
  }

  $('#grid-spacing').val(gridSpacing);
  $('#grid-line-width').val(gridLineWidth);
  colorPicker.color.hexString = gridColor;
}

$(document).ready(function(){
  colorPicker = new iro.ColorPicker('#grid-color-picker', {
    borderWidth: 2,
    width: $('#grid-color-picker').width(),
    layout: [
      {
        component: iro.ui.Slider,
        options: {
          borderColor: '#000000'
        }
      }
    ]
  });
  
  colorPicker.on('color:change', function(color){
    gridColor = color.hexString;
    change_grid_config();
  });

  update_grid_config_ui();
});