
var net = require('net');
var connections = [];

// Start a TCP Server
net.createServer(function (socket) {
 
    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort
 
    // Put this new client in the list
    connections.push(socket);
 
    // Send a nice welcome message and announce
    //console.log(socket.name + " connected\n");
 
    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        //console.log("incoming data");
        readMsg(data, sendAck, socket);
    });
 
    // Remove the client from the list when it leaves
    socket.on('end', function () {
        connections.splice(connections.indexOf(socket), 1);
        log.info(socket.UnitID + " Disconnected.\n");
    });

    
    function readMsg(data, ackCallback, sock){
        //console.log("Length: " + data.length);
        
        var greeting = data.toString('ascii', 0,4);

        if(greeting === "MCGP"){
            var posMsg = require('./PositionMessage');
            posMsg.encode(data);

            sock.UnitID = posMsg.unitID;
            log.info("Unit " + unitID + " connected");

            var conn = require('./DbConnection');
            conn.storeMessage(posMsg);

            ackCallback(posMsg.unitID, posMsg.numerator, sock);
            setTimeout(triggerWrites, 60000);
        }
    };

    function sendAck(unitID, numerator, sock){
        var ack = require('./ack.js');
        var out = ack.encode(unitID, numerator);
        
        sock.write(out, 0, 28, 'utf-8');
    }

}).listen(231);

function triggerWrites(){
    var conn = require('./DbConnection');
    conn.storeInDB(function(){
        log.info('Messsages written.');
        setTimeout(triggerWrites, 60000);
    });
}