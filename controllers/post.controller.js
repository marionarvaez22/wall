const PostsModel = require('../models/posts.model');
var moment = require('moment');
var Ejs = require('ejs');
var Path = require('path');
const Helper = require('../helpers/index');

class PostController {

    constructor() {

    }

    async wonderwall(req, res) {
        if(req.session.user_data){
            let response_data = await PostsModel.fetchMessages();
            res.render("wonderwall.ejs", {user_data: req.session.user_data, messages: response_data.result, moment: moment});
        }
        else{
            res.redirect("/");
        }
    }

    async addMessage(req, res) {
        let response_data = {status: false, result: {}, error: ""};

        let validate_input = await Helper.validateInput({require: "message"}, req)

        if(validate_input.status){
            response_data = await PostsModel.addMessage({user_id: req.session.user_data.id, message: req.body.message, created_at: new Date()}, {name: req.session.user_data.first_name +' '+ req.session.user_data.last_name} );

            if(response_data){
                let message_html = await Ejs.renderFile(
                    Path.join(__dirname, "../views/templates/message.ejs"),
                    { message: response_data.result, user_data: {id: req.session.user_data.id}, moment: moment },
                    {async: true}
                );
    
                response_data.result.html = message_html;
            }
            else{
                response_data.message = response_data.message
            }
        }
        else{
            response_data.message = validate_input.message;
        }

        res.json(response_data);
    }

    async addComment(req, res) {
        let response_data = {status: false, result: {}, error: ""};

        let validate_input = await Helper.validateInput({require: "comment"}, req)

        if(validate_input.status){
            response_data = await PostsModel.addComment({user_id: req.session.user_data.id, message_id: req.body.message_id, comment: req.body.comment, created_at: new Date()}, {name: req.session.user_data.first_name +' '+ req.session.user_data.last_name} );

            if(response_data){
                let comment_html = await Ejs.renderFile(
                    Path.join(__dirname, "../views/templates/comment.ejs"),
                    { comment: response_data.result, user_data: {id: req.session.user_data.id}, moment: moment },
                    {async: true}
                );

                response_data.result.html = comment_html;
                res.json(response_data);
            }
            else{
                response_data.message = response_data.message
            }
        }
        else{
            response_data.message = validate_input.message;
        }

        res.json(response_data);
    }

    async deleteMessage(req, res) {
        let response_data = await PostsModel.processdeleteMessage({user_id: req.session.user_data.id, message_id: parseInt(req.body.message_id)});
        res.json(response_data);
    }

    async deleteComment(req, res) {
        let response_data = await PostsModel.processdeletingComment({user_id: req.session.user_data.id, comment_id: parseInt(req.body.comment_id)});
        res.json(response_data);
    }
}

module.exports = PostController;