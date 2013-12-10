
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
        //console.log(socket.name + " Disconnected.\n");
    });

    
    function readMsg(data, ackCallback, sock){
        //console.log("Length: " + data.length);
        
        var greeting = data.toString('ascii', 0,4);

        if(greeting === "MCGP"){
            //console.log("Cellocator msg!");
            var posMsg = require('./PositionMessage');
            posMsg.encode(data);

            //console.log("UnitID = " + posMsg.unitID);
            //console.log("Numerator = " + posMsg.numerator);
            //console.log("Lat = " + posMsg.latitude);
            //console.log("Lon = " + posMsg.longitude);
            //console.log("Date = " + posMsg.gpsDate);
            //console.log("sat = " + posMsg.numberOfSatellites);
            //console.log("Speed = " + posMsg.speed);
            //console.log("Direction = " + posMsg.direction);

            ackCallback(posMsg.unitID, posMsg.numerator, sock);
        }else {
            //console.log("something different connected");
            //console.log(greeting);
            }
    };

    function sendAck(unitID, numerator, sock){
        var ack = require('./ack.js');
        var out = ack.encode(unitID, numerator);
        
        sock.write(out, 0, 28, 'utf-8');
    }

}).listen(231);
