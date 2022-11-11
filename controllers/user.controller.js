const UsersModel = require('../models/users.model');
const Helper = require('../helpers/index');

class UserController {

    constructor() { 

    }
 
    async index(req, res) {      
        if(req.session.user_data){
            res.redirect("/wonderwall");
        }
        else{
            res.render("index.ejs");
        }
    }

    async login(req, res) {
        let response_data = {status: false, result: {}, error: ""};

        let validate_input = await Helper.validateInput({require: "email_address,password"}, req)

        if(validate_input.status){
            response_data = await UsersModel.loginUser({email_address: req.body.email_address, password: req.body.password} );

            if(response_data.status){
                req.session.user_data = response_data.result;
                response_data.result.redirect_url = "/wonderwall";
            }
        }
        else{
            response_data.message = validate_input.message;
        }


        res.json(response_data);
    }

    async processRegistration(req, res) {
        let response_data = {status: false, result: {}, error: ""};

        let validate_input = await Helper.validateInput({require: "first_name,last_name,email_address,password,confirm_password"}, req)

        if(validate_input.status){
            response_data = await UsersModel.processRegistration(req.body);

            if(response_data.status){
                req.session.user_data = response_data.result;
                response_data.result.redirect_url = "/wonderwall";
            }        
        }
        else{
            response_data.message = validate_input.message;
        }

        res.json(response_data);
    }

    async logout(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = UserController;