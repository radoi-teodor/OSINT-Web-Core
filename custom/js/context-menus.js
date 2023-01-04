menuItems = [

];


$(document).ready(function(){
  for (let key in NodeType) {
    if (NodeType.hasOwnProperty(key)) {
       if(!nodeMenus.hasOwnProperty(key)){
         nodeMenus[key] = [];
       }
       if(!nodeMenus.hasOwnProperty(key+'Transforms')){
         nodeMenus[key+'Transforms'] = [];
       }

       if(!allNodeTransforms.hasOwnProperty(key)){
        allNodeTransforms[key] = [];
       }

       nodeMenus[key].push({
         content: `View Transforms`,
         hasChildren: true,
         events: {
           click: (e) => {
             myMenu.refreshItems(nodeMenus[key+'Transforms']);
           }
         }
       });
 
       nodeMenus[key].push({
         content: `View Node`,
         events: {
           click: (e) => {
             showNodeData(selectedNode);
           }
         }
       });
 
       nodeMenus[key].push({
         content: `Delete Node`,
         events: {
           click: (e) => {
              deleteNode(selectedNode);
              prepareFocusedNodes();
           }
         }
       });
    }
 }
 
 $('.node-create .contents').empty();

 for (let key in NodeType) {
   var creatable = false;
 
   if(NodeType[key].hasOwnProperty('creatable') && NodeType[key].creatable == true){
     creatable = true;
   }
 
   if(creatable){
     menuItems.push(  {
       content: `Create ` + key,
       events: {
         click: (e) => {
           show_create_node_modal(key);
         }
       }
     });

     $('.node-create .contents').append(`
      <div class="create-node-button w-100 text-light border" id="create-${key}-button">
        <p><span class="bullet" style="color: ${NodeType[key].color};">&#9642;</span> <span class="text">Create ${key}</span></p>
      </div>
     `);
     $('#create-'+key+'-button').click(function(){
      show_create_node_modal(NodeType[key].name);
     });
   }
 }
 
  myMenu = new ContextMenu({
    target: "#graph-container",
    menuItems
  });
  myMenu.init();
  $transforms = $.ajax(
    {
      url: 'backend/requests.php', 
      data: {
        modules: 'show'
      },
      success: function(data){
        for (let key in data) {
          let moduleName = key;
          let allowed = data[moduleName]['allowed'];


          for (let indexAllowed in allowed){
            let nodeType = allowed[indexAllowed];
            let transformName = data[moduleName]['name'];
            let transformCategory = data[moduleName]['category'];

            if(!nodeMenus[nodeType+'Transforms'].hasOwnProperty(transformCategory)){
              nodeMenus[nodeType+'Transforms'].push({
                content: transformCategory,
                hasChildren: true,
                events: {
                  click: (e) => {
                    var transformCategoryLocal = transformCategory;
                    myMenu.refreshItems(nodeMenus[nodeType+'Transforms'][transformCategoryLocal]);
                  }
                }
              });
              nodeMenus[nodeType+'Transforms'][transformCategory] = []
            }

            if(!allNodeTransforms.hasOwnProperty(nodeType)){
              allNodeTransforms[nodeType] = [];
            }

            allNodeTransforms[nodeType].push(data[moduleName]);


            nodeMenus[nodeType+'Transforms'][transformCategory].push({
              content: transformName,
              events: {
                click: (e) => {
                  var selectedNodeLocal = selectedNode;
                  executeTransform(moduleName, data[moduleName], selectedNodeLocal)
                }
              }
            });

          }
        }
      }
    });  
});
