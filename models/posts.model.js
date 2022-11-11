const Mysql                 = require('mysql');
const Model 				= require('./model');

class PostsModel extends Model {
	constructor() {
		super();
	}

    async fetchMessages(){
		let response_data = {status: false, result: {}, error: null};

        try{
            let fetch_messages_query = Mysql.format(`
                SELECT messages.id, user_id, message, messages.created_at AS message_created_at, CONCAT(users.first_name, " ", users.last_name) AS name,
                (
                    SELECT 
                        JSON_ARRAYAGG(JSON_OBJECT(
                            "commenter", CONCAT(users.first_name, " ", users.last_name),
                            "comment_id", comments.id,
                            "user_id", comments.user_id,
                            "message_id", comments.message_id,
                            "comment", comments.comment,
                            "comment_created_at", comments.created_at
                        ))
                    FROM comments 
                    INNER JOIN users ON users.id = comments.user_id
                    WHERE comments.message_id = messages.id
                    GROUP BY comments.message_id
                ) AS comments
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                ORDER BY messages.id DESC;
            `);

            let fetch_messages_results = await this.executeQuery(fetch_messages_query);

            if(fetch_messages_results){
                response_data.status = true;
                response_data.result = fetch_messages_results;
            }
            else{
                response_data.message = "No messages found.";
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "No messages found.";
        }
    
        return response_data;
    }

    async addMessage(params, messenger) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
			let add_message_query = Mysql.format(`INSERT INTO messages SET ?`,  [params]);
			let add_message_result = await this.executeQuery(add_message_query);

            response_data.status = add_message_result.affectedRows > 0; 
            response_data.result = params;
            response_data.result.name = messenger.name;
            response_data.result.id = add_message_result.insertId;
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered when adding a message.";
		}
	
		return response_data;		
	}

    async addComment(params, commenter) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
			let add_comment_query = Mysql.format(`INSERT INTO comments SET ?`,  [params]);
			let add_comment_result = await this.executeQuery(add_comment_query);

            response_data.status = add_comment_result.affectedRows > 0; 
            response_data.result = params;
            response_data.result.commenter = commenter.name;
            response_data.result.comment_id = add_comment_result.insertId;
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered when adding a comment.";
		}

		return response_data;		
	}

    async processdeleteMessage(params) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
            let fetch_message = await this.fetchMessage(params.message_id)

            if(fetch_message.status){
                if(fetch_message.result[0].user_id === params.user_id){
                    let fetch_message_comment_ids = await this.fetchMessageCommentIds(fetch_message.result[0].id);
                    let delete_message  = await this.deleteMessage(fetch_message.result[0].id);

                    if(delete_message.status){
                        response_data.status = true;

                        if(fetch_message_comment_ids.status){
                            let delete_message_comments = await this.deleteComment(fetch_message_comment_ids.result.ids.split(',').map(Number));

                            if(!delete_message_comments.status){
                                response_data.status = false;
                                response_data.message = delete_message_comments.message;
                            }
                        }
                        else{
                            response_data.message = fetch_message_comment_ids.message;
                        }
                    }
                }
                else{
                    response_data.message = "You do not own this message";
                }
            }
            else{
                response_data.message = fetch_message.message;
            }

		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while deleting message.";
		}

		return response_data;		
	}

    async processdeletingComment(params) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
            let fetch_comment = await this.fetchComment(params.comment_id)

            if(fetch_comment.status){
                if(fetch_comment.result[0].user_id === params.user_id){
                    let delete_comment = await this.deleteComment(fetch_comment.result[0].id);

                    if(delete_comment.status){
                        response_data.status = true;
                    }
                    else{
                        response_data.message = delete_comment.message;
                    }
                }
                else{
                    response_data.message = "You do not own this comment.";
                }
            }
            else{
                response_data.message = fetch_comment.message;
            }
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while deleting message.";
		}

		return response_data;		
	}

    async fetchMessage(message_id){
		let response_data = {status: false, result: {}, error: null};
		
		try{
            let select_message_query = Mysql.format(`SELECT * FROM messages WHERE id IN (?)`,  [message_id]);
            let select_message_result = await this.executeQuery(select_message_query);

            if(select_message_result){
                response_data.status = true;
                response_data.result = select_message_result;
            }
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while fetching message.";
		}

		return response_data;	
    }

    async fetchMessageCommentIds(message_id){
		let response_data = {status: false, result: {}, error: null};
		
		try{
            let fetch_message_comments_query = Mysql.format(`SELECT GROUP_CONCAT(id) as ids FROM comments WHERE message_id IN (?)`,  [message_id]);
            let [fetch_message_comments_result] = await this.executeQuery(fetch_message_comments_query);

            if(fetch_message_comments_result && fetch_message_comments_result.ids){
                response_data.status = true;
                response_data.result = fetch_message_comments_result;
            }

            console.log(response_data)

		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while fetching message commend ids.";
		}

		return response_data;	
    }

    async fetchComment(comment_id){
		let response_data = {status: false, result: {}, error: null};
		
		try{
            let select_comment_query = Mysql.format(`SELECT * FROM comments WHERE id IN (?)`,  [comment_id]);
            let select_comment_result = await this.executeQuery(select_comment_query);

            if(select_comment_result){
                response_data.status = true;
                response_data.result = select_comment_result;
            }
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while fetching comment.";
		}

		return response_data;	
    }

    async deleteMessage(message_ids) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
			let delete_message_query = Mysql.format(`DELETE FROM messages WHERE id IN (?)`,  [message_ids]);
			let delete_message_result = await this.executeQuery(delete_message_query);

            if(delete_message_result.affectedRows){
                response_data.status = true;
            }
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while deleting message.";
		}

		return response_data;		
	}

    async deleteComment(comment_ids) {
		let response_data = {status: false, result: {}, error: null};
		
		try{
			let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE id IN (?)`,  [comment_ids]);
			let delete_comment_result = await this.executeQuery(delete_comment_query);
            console.log(delete_comment_query)
            console.log(delete_comment_query)
            if(delete_comment_result.affectedRows){
                response_data.status = true;
            }
		}
        catch(error){
			response_data.error = error;
			response_data.message = "Error encountered while deleting comment/s.";
		}

		return response_data;		
	}
}

module.exports = (function Posts(){
    return new PostsModel();
})();