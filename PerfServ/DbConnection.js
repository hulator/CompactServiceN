var positionMessages = [];
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
exports.TYPES = TYPES;  //used to form parameters to send in

var fs = require('fs');
var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: './configs/connectionConfig.json' });

var poolApi = require('generic-pool');
var poolConfig = require('./configs/poolConfig.json');

var pool = poolApi.Pool({
  name: poolConfig.name,
  max: poolConfig.max,
  min: poolConfig.min,
  idleTimeoutMillis: poolConfig.idleTimeoutMillis,
  create: function(callback) {
    try{
      new Connection(nconf).on('connect',function(err){
        if(err){
          console.log(err)
        }
        else{
          callback(err,this)
        }
      })
    }
    catch(err){
      console.log(err)
    }
  },
  destroy: function(conn) {
    conn.close();
  }

});

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
			
            pool.acquire(function(err, conn){
                if(err){
                    console.log(err);
                } else {
                    request = new Request("select 42, 'hello world'", function(err, rowCount) {
                        if(err){
                            console.log("error");
                        }
                    });
                    
                    request.on('row', function(columns) {
                      columns.forEach(function(column) {
                        console.log(column.value);
                      });
                      pool.release(conn);
                    });

                    conn.execSql(request);
                }
            });
		}
	};
}());