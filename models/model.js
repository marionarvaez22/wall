const connection    = require('../config/database.js');

class Model {
	constructor(req = undefined, force_log = false){
		this.req = req;
		this.force_log = force_log;
	}

	executeQuery(query) {
		return new Promise((resolve, reject) => {
			connection.query(query, function (err, result) {
				if(err) {
					reject(err);
				}else{
		        	resolve(result);
		        }
		    });
		});		
	}
}

module.exports = Model;
