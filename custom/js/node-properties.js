function setResultsLimit(){
    resultLimit = $('#search-number-limit').val();
}

function addOptionPropertyToPanel(name, value){
    $('#focused-node-properties').append(`
    <div class="row node-property">
        <div class="col-6">
        <p class="text-muted">${name}</p>
        </div>
        <div class="col-6">
        <p class="text-muted">${value}</p>
        </div>
    </div>
    `);
}

function showSelectedNodeProperties(node=null){
    $('#focused-node-properties').empty();

    if(node == null){
        $('#focused-node-properties').html(`
            <p class="text-light" id="no-property-paragraph">No property</p>
        `);
        return;
    }

    addOptionPropertyToPanel('Title', node.title);
    addOptionPropertyToPanel('Type', node.type.name);

    if(node.details && node.details != 'none'){
        let splitDetails = node.details.split('<br/>');

        for(let i = 0; i < splitDetails.length; i++){
            if(!splitDetails[i] || splitDetails[i].trim() == '' || !splitDetails[i].includes(':') || splitDetails[i].split(':').length != 2){
                continue;
            }            

            let keyValueSplit = splitDetails[i].split(':');

            var detailName = keyValueSplit[0].trim();
            var detailValue = keyValueSplit[1].trim();

            addOptionPropertyToPanel(detailName, detailValue);
        }
    }
    $('#focused-node-properties').append(`
    <div class="row node-property">
        <button class="btn btn-dark w-100" id="open-view-modal-properties-button">Open details</button>
    </div>
    `);

    $('#open-view-modal-properties-button').click(function(e){
        showNodeData(node);
    });
}

$(document).ready(function(){
    $('#focused-node-properties').on("mousedown", function(e){
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    });

    $('.modal').on("mousedown", function(e){
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    });
});