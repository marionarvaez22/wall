const Express = require("express");
const AllRoutes  = Express.Router();
const UserController = require('../controllers/user.controller');
const PostController        = require('../controllers/post.controller');

AllRoutes.get("/", function(req, res, next) {
    new UserController().index(req, res);
});

AllRoutes.post("/login", function(req, res, next) {
    new UserController().login(req, res);
});

AllRoutes.post("/process_registration", function(req, res, next) {
    new UserController().processRegistration(req, res);
});

AllRoutes.get("/logout", function(req, res, next) {
    new UserController().logout(req, res);
});

AllRoutes.get("/wonderwall", function(req, res, next) {
    new PostController().wonderwall(req, res);
});

AllRoutes.post("/add_message", function(req, res, next) {
    new PostController().addMessage(req, res);
});

AllRoutes.post("/add_comment", function(req, res, next) {
    new PostController().addComment(req, res);
});

AllRoutes.post("/delete_message", function(req, res, next) {
    new PostController().deleteMessage(req, res);
});

AllRoutes.post("/delete_comment", function(req, res, next) {
    new PostController().deleteComment(req, res);
});



module.exports = AllRoutes;