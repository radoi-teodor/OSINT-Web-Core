$('.logs').bind('DOMNodeInserted DOMNodeRemoved', function(){
    $('.logs').scrollTop($('.logs')[0].scrollHeight);
});

$(document).ready(function(){
    $('.logs').empty();
    $('.logs').animate({ scrollTop: $('.logs').height() }, 100);
});

function log(text){
    $('.logs').append(`
        <p class="text-light">${text}</p>
    `);
}

function logWarning(text){
    $('.logs').append(`
        <p class="text-warning">${text}</p>
    `);
}

function logError(text){
    $('.logs').append(`
        <p class="text-danger">${text}</p>
    `);
}

function logSuccess(text){
    $('.logs').append(`
        <p class="text-success">${text}</p>
    `);
}