"use strict";
exports.__esModule = true;
exports.room = exports.item = exports.client = void 0;
// import dgram from 'dgram';
var dgram = require("dgram");
var server = dgram.createSocket('udp4');
var clients = [];
var client = /** @class */ (function () {
    function client() {
    }
    client.prototype.setName = function (name) {
        this.name = name;
    };
    return client;
}());
exports.client = client;
var item = /** @class */ (function () {
    function item() {
    }
    return item;
}());
exports.item = item;
var room = /** @class */ (function () {
    function room() {
    }
    return room;
}());
exports.room = room;
server.on('error', function (err) {
    console.log("server error:", err);
    server.close();
});
server.on('message', function (msg, rinfo) {
    if (clients.length > 0) {
        var ports = [];
        clients.forEach(function (client) {
            ports.push(client.port);
        });
        if (!ports.includes(rinfo.port)) {
            clients.push(rinfo);
        }
    }
    else {
        clients.push(rinfo);
        console.log(clients);
    }
    var command = msg.toString().split(":")[0].toLowerCase();
    console.log(msg);
    switch (command) {
        case "welcome":
            server.send("Bem vindo ao servidor!", rinfo.port);
            break;
        case "examinar":
            server.send("Voce examinou a sala!", rinfo.port);
            break;
        case "mover":
            server.send("Voce se moveu!", rinfo.port);
            break;
        case "pegar":
            server.send("Voce pegou o objeto!", rinfo.port);
            break;
        case "largar":
            server.send("Voce largou o objeto!", rinfo.port);
            break;
        case "inventario":
            server.send("Itens do seu inventario:", rinfo.port);
            break;
        case "usar":
            server.send("Voce usou o objeto");
            break;
        case "falar":
            var message = msg.toString().split(":")[1];
            clients.forEach(function (current) {
                server.send(message, 0, message.length, current.port, current.address);
            });
            break;
        case "cochichar":
            server.send("Voce usou o cochichou");
            break;
        case "ajuda":
            server.send("\nLista de comandos: \n 'examinar:' serve para examinar uma determiada sala", rinfo.port);
            break;
        case "setarnome":
            var client_1 = clients.filter(function (x) { return x.address == rinfo.address && x.port == rinfo.port; })[0];
            var index = clients.indexOf(client_1);
            clients[index].name = msg.toString().split(":")[1].trim();
            server.send("Nome setado para: ".concat(clients[index].name), rinfo.port);
            break;
        case "nome":
            client_1 = clients.filter(function (x) { return x.address == rinfo.address && x.port == rinfo.port; })[0];
            server.send("Seu nome eh: ".concat(client_1.name), rinfo.port);
            break;
        default:
            server.send("Comando invalido digite 'ajuda:' pra ver a lista de comandos", rinfo.port);
    }
});
server.on('listening', function () {
    var address = server.address();
    console.log("server listening ".concat(address.address, ":").concat(address.port));
});
server.bind(3000);
