$(document).ready(function() {
    $("body")
      .on("submit", "#add_message", addMessage)
      .on("submit", ".add_comment", addComment)
      .on("click", ".delete_message", deleteMessage)
      .on("click", ".delete_comment", deleteComment);
});

function addMessage(e){
    e.preventDefault();
    let form = $("#add_message");

    $.post(form.attr("action"), form.serialize(), function(response_data) {
        if(response_data.status){
            $("body").find('#main_wall').prepend(response_data.result.html);
            form[0].reset();
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function addComment(e){
    e.preventDefault();
    let form = $(this);

    $.post(form.attr("action"), form.serialize(), function(response_data) {
        if(response_data.status){
            $("body").find('.message_'+response_data.result.message_id+'_comments').append(response_data.result.html);
            form[0].reset();
        }        
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function deleteMessage(e){
    e.preventDefault();
    let message = $(this);

    $.post("/delete_message", {message_id: parseInt(message.attr("data-attr-message-id"))}, function(response_data) {
        if(response_data.status){
            $("#main_wall").find(".message_"+message.attr("data-attr-message-id")).remove();
        }
    }, "json");

    return false;
}

function deleteComment(e){
    e.preventDefault();
    let comment = $(this);
    console.log(parseInt(comment.attr("data-attr-comment-id")))
    $.post("/delete_comment", {comment_id: parseInt(comment.attr("data-attr-comment-id"))}, function(response_data) {
        
        if(response_data.status){
            $("#main_wall").find(".comment_"+comment.attr("data-attr-comment-id")).remove();
        }
    }, "json");

    return false;
}

