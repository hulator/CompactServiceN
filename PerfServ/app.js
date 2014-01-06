
var net = require('net');
var connections = [];
var filelog = require('filelog');
var log = filelog.create({
  'file' : '{YYYY.MM.DD}.log', 
  'level' : filelog.WARN | filelog.ERROR | filelog.NOTICE
});

// Start a TCP Server
net.createServer(function (socket) {
    log.notice("server started");
    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort
 
    // Put this new client in the list
    connections.push(socket);
 
    // Send a nice welcome message and announce
    //console.log(socket.name + " connected\n");
 
    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        readMsg(data, sendAck, socket);
    });
 
    // Remove the client from the list when it leaves
    socket.on('end', function () {
        connections.splice(connections.indexOf(socket), 1);
        log.notice(socket.UnitID + " Disconnected.\n");
    });

    
    function readMsg(data, ackCallback, sock){
                
        var greeting = data.toString('ascii', 0,4);

        if(greeting === "MCGP"){
            var posMsg = require('./PositionMessage');
            posMsg.encode(data);

            sock.UnitID = posMsg.unitID;
            log.notice("PosMsg(" + posMsg.unitID + ")");

            var conn = require('./DbConnection');
            conn.storeMessage(posMsg);

            ackCallback(posMsg.unitID, posMsg.numerator, sock);
        }
    };

    function sendAck(unitID, numerator, sock){
        var ack = require('./ack.js');
        var out = ack.encode(unitID, numerator);
        
        sock.write(out, 0, 28, 'utf-8');
    };

    setTimeout(triggerWrites, 2000);

}).listen(231);

function triggerWrites(){
    var conn = require('./DbConnection');
    conn.storeInDb(function(){
        log.notice('Messsages written.');
        setTimeout(triggerWrites, 60000);
    });
}