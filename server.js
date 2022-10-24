const dgram = require('dgram');
const server = dgram.createSocket('udp4');
clients = [];

server.on('error', (err) => {
    console.log(`server error:`, err);
    server.close();
});

server.on('message', (msg, rinfo) => {
    if (clients.length > 0) {
        var ports = [];
        clients.forEach(client => {
            ports.push(client.port);
        })

        if (!ports.includes(rinfo.port)) {
            clients.push(rinfo);
        }
    } else {
        clients.push(rinfo);
    }
    console.log(clients);
    // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // Echo message back to client
    this.brodcast(msg);
    // server.send("I got a message from you: " + msg, rinfo.port);
});

this.brodcast = function (message) {

    var _buffer = new Buffer(message);

    clients.forEach(function (current) {
        console.log("opa")
        server.send(_buffer, 0, _buffer.length, current.port, current.address);
    });

};

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3000);