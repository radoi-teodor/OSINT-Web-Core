$(document).ready(function(){
    // Layout container
    $('.layout-container').empty();
    for(var key in allLayoutsOptions){
        $('.layout-container').append(`
        <div class="layout" id="${allLayoutsOptions[key]['options'].name}">
            <div class="layout-flex">
            <div>
                <img src="imgs/top-options/layout-icons/${key}.png" alt="">
                <p>${key}</p>
            </div>
            </div>
        </div>
        `);
        var localLayout = allLayoutsOptions[key];
        $('#'+localLayout['options'].name).click(function(){
            var layoutId = $(this).attr('id');
            var layoutName = ucfirst(layoutId);

            graphLayoutOptions = allLayoutsOptions[layoutName]['options'];
            graph.layout(graphLayoutOptions).run();
            graph.center();
            $('.layout').removeClass('selected');
            $(this).addClass('selected');

            log('Nodes aligned => ' + layoutName);
        });
    }
    $('.layout').removeClass('selected');
    $('.layout#'+graphLayoutOptions.name.toLowerCase()).addClass('selected');
});