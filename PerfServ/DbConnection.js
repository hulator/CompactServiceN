var positionMessages = [];

(function(){
	module.exports = {
		storeMessage: function(message){
			//messages is an PositionMessage
			positionMessages.push(message);
		},

		storeInDb : function(callback){
			if(positionMessages.length === 0){
				callback();
				return;
			}
			var msg = positionMessages.shift();
			//TODO: add sql-insertion
			sql.insert(function(err){
				this.storeInDb(callback);
			});
		}
	};
}());