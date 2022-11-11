const md5 = require("md5");
var validator = require("email-validator");

class Helper {
    async encryptString(string){
        let encrypted_string = null;

        if(string){
            encrypted_string = md5(string+'wall');
        }

        return encrypted_string;
    }

    validateInput(options={}, req) {
        let status          = true;

        let required_fields = [];
        let filtered_fields = {};
        let error_message = "";

        if(options.require){
            required_fields = options.require.split(",").map(v => v.trim());
        }

        for(let field of required_fields){

            if(req.body[field]){
                filtered_fields[field] = req.body[field];
            }
            else{
                status = false;
                error_message = "Please enter values on all the required inputs.";
            }

            if(field === "email_address"){
                let check_email = validator.validate(req.body[field]);

                if(!check_email){
                    status = false;
                    error_message = "Please enter a valid email address.";
                }
            }
            else if(field === "confirm_password"){
                if(req.body[field] !== req.body["password"]){
                    status = false;
                    error_message = "Password did not match.";
                }
            }
        }

        if(status){
            return {status, filtered_fields: filtered_fields};
        }
        else{
            return {status, message: error_message};
        }        
    }
}

module.exports = (function Help(){
    return new Helper();
})();