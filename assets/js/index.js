$(document).ready(function() {
    $("body")
      .on("submit", "#login", Login)
      .on("submit", "#register", Register);
});

function Login(e){
    e.preventDefault();
    let form = $("#login");

    $.post(form.attr("action"), form.serialize(), function(response_data) {
        if(response_data.status && response_data.result.redirect_url) {
            window.location.href = response_data.result.redirect_url;
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function Register(e){
    e.preventDefault();
    let form = $("#register");

    $.post(form.attr("action"), form.serialize(), function(response_data) {
        console.log(response_data)
        if(response_data.status && response_data.result.redirect_url) {
            window.location.href = response_data.result.redirect_url;
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}