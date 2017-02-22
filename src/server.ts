import net = require('net');//import socket module
import ip = require('ip');

// define address interface
interface Address { port: number; family: string; address: string; };

// create socket server
let server:net.Server = net.createServer();

let clients:net.Socket[] = [];
// when the server is connected
server.on('connection', function(socket:net.Socket){
    function broadcast(name:String, message:String) {
        clients.forEach(function(client:net.Socket) {
            if (client != socket) {
                client.write('[' + name + ']' + message + '\n');
            }
        });
    }

    console.log('connected: ' + socket.remoteAddress);
    clients.push(socket);
    socket.write('Hi dood whats your name? \n');
    let name:String = '';

    // when data is sent to the socket
    socket.on('data', function(data){
        let message:String = data.toString();
        if (message.length == 0) {
            socket.write(`(you gotta type something and hit return)\n`);
            return;
        }
        if (!name) {
            name = data.toString().substr(0, 10);

            socket.write('Hello ' + name + '!\n');
            socket.write('Welcome to the chat room, ' + name + '!\n');
            socket.write('There are ' + clients.length + ' people here.\n');
            socket.write("Type messages, or type 'exit' at any time to leave.\n");
        }
        else {
            if ('exit' === message) {
                socket.end();
            }
            else {
                broadcast(name, message);
            }
        }
    });
});



});

//when the server starts listening...
server.on('listening', function() {
    //output to the console the port number on which we are listening
    var addr:Address = server.address();
    console.log(addr.address);
    console.log('server listening on port %d', addr.port);
});

//start the server
server.listen({
  host: ip.address(),
  port: 3000
});