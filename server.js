"use strict";
exports.__esModule = true;
exports.adjacentRoom = exports.room = exports.enemy = exports.item = exports.client = void 0;
var dgram = require("dgram");
var server = dgram.createSocket('udp4');
var Overlap = require('overlap');
var Couleurs = require('couleurs');
var Box = require('cli-box');
var client = /** @class */ (function () {
    function client() {
    }
    return client;
}());
exports.client = client;
var item = /** @class */ (function () {
    function item(name, isKey, isSword, isEnemy, description, life) {
        this.name = name;
        this.isKey = isKey;
        this.isSword = isSword;
        this.isEnemy = isEnemy;
        this.life = life;
        this.description = description;
    }
    return item;
}());
exports.item = item;
var enemy = /** @class */ (function () {
    function enemy(name, life) {
        this.name = name;
        this.life = life;
    }
    return enemy;
}());
exports.enemy = enemy;
var room = /** @class */ (function () {
    function room(id, name, users, objects, isOpen, adjacentRooms, description) {
        this.id = id;
        this.name = name;
        this.users = users;
        this.objects = objects;
        this.isOpen = isOpen;
        this.adjacentRooms = adjacentRooms;
        this.description = description;
    }
    room.prototype.examinar = function () {
        return "Voce esta na sala: ".concat(this.name, "\n    \nA sala esta: ").concat(this.roomIsOpen(), "\n    \nAs salas adjacentes e suas posicoes sao:").concat(this.getSalas(), "\n    \nOs itens presentes nela sao:").concat(this.getItems(), "\n    \nOs jogadores presentes nela sao:").concat(this.getUsers());
    };
    room.prototype.roomIsOpen = function () {
        return this.isOpen ? "Aberta" : "Fechada";
    };
    room.prototype.getUsers = function () {
        var usuarios = "";
        this.users.forEach(function (x) {
            if (x.name) {
                usuarios = "".concat(usuarios, " | ").concat(x.name);
            }
            else {
                console.log(x.address, x.port);
                usuarios = "".concat(usuarios, " | ").concat(x.address, ":").concat(x.port);
            }
        });
        return usuarios;
    };
    room.prototype.setOpen = function () {
        this.isOpen = true;
    };
    room.prototype.getSalas = function () {
        if (this.adjacentRooms.length > 0) {
            var salas_1 = "";
            this.adjacentRooms.forEach(function (x) {
                salas_1 = "".concat(salas_1, " | ").concat(x.name, " na posicao ").concat(x.position);
            });
            return salas_1;
        }
        else {
            return "Nenhuma sala adjacente!";
        }
    };
    room.prototype.getItems = function () {
        if (this.objects.length > 0) {
            var items_1 = "";
            this.objects.forEach(function (x) {
                items_1 = "".concat(items_1, " | ").concat(x.name);
            });
            return items_1;
        }
        else {
            return "Nenhum item!";
        }
    };
    return room;
}());
exports.room = room;
var adjacentRoom = /** @class */ (function () {
    function adjacentRoom(id, position, name) {
        this.id = id;
        this.position = position;
        this.name = name;
    }
    return adjacentRoom;
}());
exports.adjacentRoom = adjacentRoom;
var clients = [];
var key = new item("Chave", true, false, false, "Chave: pode ser utilizada para abrir qualquer sala, basta digitar a posicao em que a porta da sala esta, por exemplo usar: chave L");
var sword = new item("Espada", false, true, false, "Espada: pode ser utilizada para atacar seus inimigos");
var dragon = new item("Dragao", false, false, true, "Dragao: ele eh seu inimigo", 30);
var nameRoom1 = 'Sala1';
var nameRoom2 = 'Sala2';
var nameRoom3 = 'Sala3';
var nameRoom4 = 'Sala4';
var nameRoom5 = 'Sala5';
var room1 = new room(1, nameRoom1, [], [key, sword], true, [new adjacentRoom(3, "L", nameRoom3)], "sala poderosa");
//deixar todas como false
var room2 = new room(2, nameRoom2, [], [key], false, [new adjacentRoom(3, "N", nameRoom3)], "sala poderosa 2");
var room3 = new room(3, nameRoom3, [], [key, sword], false, [new adjacentRoom(4, "N", nameRoom4), new adjacentRoom(1, "O", nameRoom1), new adjacentRoom(2, "S", nameRoom2)], "sala poderosa 3");
var room4 = new room(4, nameRoom4, [], [key], false, [new adjacentRoom(3, "S", nameRoom3), new adjacentRoom(5, "L", nameRoom5)], "sala poderosa 4");
var room5 = new room(5, nameRoom5, [], [dragon], false, [new adjacentRoom(4, "O", nameRoom4)], "sala poderosa 5");
var rooms = [room1, room2, room3, room4, room5];
var generatedRooms = [];
var marksConfigs = {
    nw: '╔',
    n: '═',
    ne: '╗',
    e: '║',
    se: '╝',
    s: '═',
    sw: '╚',
    w: '║'
};
var generateRooms = function (rooms, address, port) {
    rooms.forEach(function (room) {
        var player = room.users.filter(function (x) { return x.port == port && x.address == address; })[0] ? 'X' : '';
        var box = Box({
            w: 10,
            h: 2,
            marks: marksConfigs
        }, Couleurs(player, '#c0392b'));
        generatedRooms.push(box);
    });
};
/**
 * Printa o mapa contendo a posição atual do jogador
 * @param {string} currentPlayer
 */
var printMap = function (rooms, address, port) {
    generatedRooms = [];
    generateRooms(rooms, address, port);
    var outerBox = Box({
        w: 5,
        h: 20,
        fullscreen: true,
        marks: marksConfigs
    }, {
        text: Couleurs('Localização Atual do Jogador', [255, 255, 0]),
        vAlign: 'top',
        hAlign: 'right'
    });
    // Sala 1
    var currentMap = Overlap({
        who: outerBox,
        "with": generatedRooms[0],
        where: {
            x: 50,
            y: 5
        }
    });
    // Sala 2
    currentMap = Overlap({
        who: currentMap,
        "with": generatedRooms[1],
        where: {
            x: 60,
            y: 9
        }
    });
    // Sala 3
    currentMap = Overlap({
        who: currentMap,
        "with": generatedRooms[2],
        where: {
            x: 60,
            y: 5
        }
    });
    // Sala 4
    currentMap = Overlap({
        who: currentMap,
        "with": generatedRooms[3],
        where: {
            x: 60,
            y: 1
        }
    });
    // Sala 5
    currentMap = Overlap({
        who: currentMap,
        "with": generatedRooms[4],
        where: {
            x: 70,
            y: 1
        }
    });
    server.send(currentMap, port);
};
var ajuda = function () {
    return "".concat(Couleurs("Lista de comandos disponiveis:", "#2980b9"), " \n\n  ").concat(Couleurs("mapa", [255, 255, 0]), " -- Exibe o mapa da localiza\u00E7\u00E3o atual do jogador\n\n  ").concat(Couleurs("examinar: [objeto/sala]", [255, 255, 0]), " -- Examina o objeto, sala atual ou verifica se a porta da sala adjacente esta aberta ou fechada.\n\n  ").concat(Couleurs("mover: [N/S/L/O]", [255, 255, 0]), " -- Move o jogador para uma sala\n\n  ").concat(Couleurs("pegar: [objeto]", [255, 255, 0]), " -- Coleta um objeto contido na sala atual\n\n  ").concat(Couleurs("largar: [objeto]", [255, 255, 0]), " -- Larga um objeto contido no invent\u00E1rio do jogador\n\n  ").concat(Couleurs("inventario", [255, 255, 0]), " -- Exibe o seu inventario\n\n  ").concat(Couleurs("usar: [objeto] {alvo}", [255, 255, 0]), " -- Usa um objeto. Alguns objetos podem ser usados em alvos espec\u00EDficos\n\n  ").concat(Couleurs("falar: [texto]", [255, 255, 0]), " -- Envia uma mensagem de texto para todos os jogadores presentes na sala atual\n\n  ").concat(Couleurs("cochichar: \"[texto]\" [jogador]", [255, 255, 0]), " -- Envia uma mensagem de texto para um jogador espec\u00EDfico na sala atual\n\n  ").concat(Couleurs("setarnome: [nome]", [255, 255, 0]), " -- Seta um nome para voce uilizar\n\n  ").concat(Couleurs("nome:", [255, 255, 0]), " -- Exibe seu nome atual\n\n  ").concat(Couleurs("ajuda", [255, 255, 0]), " -- Lista todos os comandos poss\u00EDveis do jogo\n\n  ");
};
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
    }
    var command = msg.toString().split(":")[0].toLowerCase();
    switch (command) {
        case "welcome":
            server.send("Bem vindo ao servidor!\n\n O seu objetivo eh chegar ate o poderoso dragao, para isso voce precisara encontrar meios para acessar as outras salas e tambem encontrar uma forma de matar o dragao.\n Boa sorte!", rinfo.port);
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    rooms[0].users.push(x);
                    x.actualRoom = rooms[0];
                    x.actualRoomIndex = 0;
                    server.send(rooms[0].examinar(), rinfo.port);
                }
            });
            break;
        case "examinar":
            var object_1 = msg.toString().split(":")[1];
            if (object_1) {
                object_1 = object_1.trim();
                clients.forEach(function (x) {
                    var _a;
                    if (x.port == rinfo.port && x.address == rinfo.address) {
                        if (object_1 == rooms[x.actualRoomIndex].name) {
                            server.send(rooms[x.actualRoomIndex].examinar(), rinfo.port);
                        }
                        else if (rooms[x.actualRoomIndex].adjacentRooms.filter(function (x) { return x.name == object_1; })[0]) {
                            var room_1 = rooms[x.actualRoomIndex].adjacentRooms.filter(function (x) { return x.name == object_1; })[0];
                            rooms.forEach(function (xs) {
                                if (xs.name == room_1.name) {
                                    server.send("A porta da sala adjacente: ".concat(xs.name, " esta: ").concat(xs.roomIsOpen()), rinfo.port);
                                }
                            });
                        }
                        else if (rooms[x.actualRoomIndex].objects.filter(function (ys) { return ys.name == object_1; })[0] || ((_a = x.inventario) === null || _a === void 0 ? void 0 : _a.filter(function (zs) { return zs.name == object_1; })[0])) {
                            var description_1 = "";
                            rooms[x.actualRoomIndex].objects.forEach(function (ys) {
                                if (ys.name == object_1) {
                                    description_1 = ys.description;
                                }
                            });
                            if (x.inventario) {
                                x.inventario.forEach(function (ys) {
                                    if (ys.name == object_1) {
                                        description_1 = ys.description;
                                    }
                                });
                            }
                            server.send(description_1, rinfo.port);
                        }
                        else {
                            server.send("O item ".concat(object_1, " nao foi encontrado na sala ou em seu inventario!"), rinfo.port);
                        }
                    }
                });
            }
            else {
                server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
            }
            break;
        case "mover":
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    var avaiablePositions_1 = [];
                    var movePosition_1 = msg.toString().split(":")[1].trim().toUpperCase();
                    x.actualRoom.adjacentRooms.forEach(function (x) {
                        avaiablePositions_1.push(x.position);
                    });
                    if (avaiablePositions_1.includes(movePosition_1)) {
                        var destinationRoom_1 = 0;
                        x.actualRoom.adjacentRooms.forEach(function (x) {
                            if (movePosition_1 == x.position) {
                                destinationRoom_1 = x.id;
                            }
                        });
                        var destinationRoomIndex_1 = 0;
                        rooms.map(function (item, index) {
                            if (destinationRoom_1 == item.id) {
                                destinationRoomIndex_1 = index;
                            }
                        });
                        var userIndex_1 = 0;
                        rooms[x.actualRoomIndex].users.map(function (item, index) {
                            if (x.port == item.port && x.address == item.address) {
                                userIndex_1 = index;
                            }
                        });
                        if (rooms[destinationRoomIndex_1].isOpen) {
                            rooms[x.actualRoomIndex].users.splice(userIndex_1, 1);
                            x.actualRoom = rooms[destinationRoomIndex_1];
                            x.actualRoomIndex = destinationRoomIndex_1;
                            rooms[destinationRoomIndex_1].users.push(x);
                            server.send("\nVoce se moveu para sala: ".concat(rooms[destinationRoomIndex_1].name), rinfo.port);
                            server.send(rooms[destinationRoomIndex_1].examinar(), rinfo.port);
                        }
                        else {
                            server.send('\nA porta dessa sala esta fechada, voce precisa abrir ela usando uma chave', rinfo.port);
                        }
                    }
                    else {
                        server.send("\nVoce tentou ir para uma posicao que nao eh valida, examine a sala para saber os caminhos", rinfo.port);
                    }
                }
            });
            break;
        case "pegar":
            var objeto = msg.toString().split(":")[1].trim();
            if (objeto == "Dragao") {
                server.send("\nVoce nao pode pegar o objeto Dragao!", rinfo.port);
                return;
            }
            var objetoPego_1 = null;
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    rooms[x.actualRoomIndex].objects.map(function (obj, index) {
                        if (obj.name == objeto && !obj.isEnemy) {
                            objetoPego_1 = obj;
                            if (!x.inventario) {
                                x.inventario = [];
                            }
                            if (x.inventario.filter(function (item) { return item.name == objetoPego_1.name; })[0]) {
                                server.send("\nVoce ja tem o item ".concat(objetoPego_1.name, " no seu inventario"), rinfo.port);
                            }
                            else {
                                x.inventario.push(obj);
                                var restantes = [];
                                rooms[x.actualRoomIndex].objects.forEach(function (x) {
                                    if (x.name != obj.name) {
                                        restantes.push(x);
                                    }
                                });
                                rooms[x.actualRoomIndex].objects = restantes;
                                server.send("\nVoce pegou o objeto: ".concat(obj.name, "!"), rinfo.port);
                            }
                        }
                    });
                }
            });
            if (!objetoPego_1) {
                server.send("\nO item ".concat(objeto, " nao existe na sala!"), rinfo.port);
            }
            break;
        case "largar":
            var objeto = msg.toString().split(":")[1].trim();
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    if (x.inventario) {
                        if (x.inventario.filter(function (x) { return x.name == objeto; })[0]) {
                            if (rooms[x.actualRoomIndex].objects.filter(function (obj) { return obj.name == objeto; })[0]) {
                                server.send("\nVoce nao pode largar o item ".concat(objeto, " aqui pois ja existe esse item nessa sala!"), rinfo.port);
                            }
                            else {
                                var itensRestantesInventario_1 = [];
                                x.inventario.forEach(function (inv) {
                                    console.log(inv);
                                    if (inv.name != objeto) {
                                        itensRestantesInventario_1.push(inv);
                                    }
                                    else {
                                        server.send("\nVoce largou o item: ".concat(inv.name), rinfo.port);
                                        rooms[x.actualRoomIndex].objects.push(inv);
                                    }
                                });
                                x.inventario = itensRestantesInventario_1;
                            }
                        }
                        else {
                            server.send("\nVoce nao tem o item: ".concat(objeto, " no seu invetario para largar"), rinfo.port);
                        }
                    }
                    else {
                        server.send("\nVoce nao tem o item: ".concat(objeto, " no seu invetario para largar"), rinfo.port);
                    }
                }
            });
            break;
        case "inventario":
            var itemsInventario_1 = "\nItens no seu inventario:";
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    if (x.inventario) {
                        x.inventario.forEach(function (item) {
                            itemsInventario_1 = "".concat(itemsInventario_1, " ").concat(item.name, " |");
                        });
                        if (!x.inventario.length) {
                            itemsInventario_1 = "\nVoce nao tem nenhum item no inventario!";
                        }
                    }
                    else {
                        itemsInventario_1 = "\nVoce nao tem nenhum item no inventario!";
                    }
                }
            });
            server.send(itemsInventario_1, rinfo.port);
            break;
        case "usar":
            var params = msg.toString().split(":")[1].trim();
            var param1 = params.split(" ")[0];
            var param2 = params.split(" ")[1];
            if (param1 && param2) {
                clients.forEach(function (x) {
                    if (x.port == rinfo.port && x.address == rinfo.address) {
                        if (x.inventario) {
                            var item = x.inventario.filter(function (inv) { return inv.name == param1; })[0];
                            if (item) {
                                if (item.isKey) {
                                    var salas = [];
                                    rooms[x.actualRoomIndex].adjacentRooms.forEach(function (sala) {
                                        salas.push(sala.name);
                                    });
                                    if (salas.includes(param2)) {
                                        rooms.forEach(function (sala) {
                                            if (sala.name == param2) {
                                                if (sala.isOpen) {
                                                    server.send("\nA: ".concat(param2, " ja esta aberta!"), rinfo.port);
                                                }
                                                else {
                                                    sala.setOpen();
                                                    server.send("\nVoce abriu a porta da: ".concat(param2), rinfo.port);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        server.send("\nVoce nao pode usar o item: ".concat(param1, " no objeto: ").concat(param2), rinfo.port);
                                    }
                                }
                                if (item.isSword) {
                                    if (param2 == "Dragao") {
                                        rooms[x.actualRoomIndex].objects.forEach(function (xs) {
                                            if (xs.name == param2) {
                                                if (xs.life == 30) {
                                                    xs.life = xs.life - 10;
                                                    server.send("\nVoce golpeia o poderoso Dragao usando a sua ".concat(param1, ", mas nao eh o suficiente para mata-lo"), rinfo.port);
                                                }
                                                else if (xs.life == 20) {
                                                    xs.life = xs.life - 10;
                                                    server.send("\nVoce acerta o Dragao em cheio e ele cai no chao, apenas mais um golpe e sua missao estara finalizada", rinfo.port);
                                                }
                                                else if (xs.life == 10) {
                                                    xs.life = xs.life - 10;
                                                    server.send("\nVoce pega sua ".concat(param1, " chega perto do Dragao e da o ultimo golpe nele, ele solta um enorme rugido e morre!"), rinfo.port);
                                                    server.send("\nParabens voce desbravou este mundo e concluiu seu objetivo de matar o dragao!", rinfo.port);
                                                }
                                                else if (xs.life == 0) {
                                                    server.send("\nO Dragao ja esta morto!", rinfo.port);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        server.send("\nVoce nao pode usar o item: ".concat(param1, " no objeto: ").concat(param2), rinfo.port);
                                    }
                                }
                            }
                            else {
                                server.send("\nVoce nao tem o item: ".concat(param1, " no seu inventario, para ver os itens do seu inventario digite inventario:"), rinfo.port);
                            }
                        }
                        else {
                            server.send("\nVoce nao tem o item: ".concat(param1, " no seu inventario, para ver os itens do seu inventario digite inventario:"), rinfo.port);
                        }
                    }
                });
            }
            else {
                server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
            }
            break;
        case "falar":
            var message = msg.toString().split(":")[1];
            clients.forEach(function (x) {
                if (x.port == rinfo.port && x.address == rinfo.address) {
                    if (rooms[x.actualRoomIndex].users) {
                        rooms[x.actualRoomIndex].users.forEach(function (current) {
                            server.send(message, 0, message.length, current.port, current.address);
                        });
                    }
                }
            });
            break;
        case "mapa":
            printMap(rooms, rinfo.address, rinfo.port);
            break;
        case "cochichar":
            var params = msg.toString().split(":")[1].trim();
            var mensagem1_1 = /"(.*?)"/.exec(params)[1];
            var param2 = params.replace("\"".concat(mensagem1_1, "\""), "").trim();
            if (msg.toString().split(":")[2]) {
                var param2 = params.replace("\"".concat(mensagem1_1, "\""), "").trim() + ":" + msg.toString().split(":")[2].trim();
            }
            console.log(param2);
            if (mensagem1_1 && param2) {
                clients.forEach(function (x) {
                    if (x.port == rinfo.port && x.address == rinfo.address) {
                        var user = rooms[x.actualRoomIndex].users.filter(function (xs) { return xs.name == param2 || "".concat(xs.address, ":").concat(xs.port) == param2; })[0];
                        console.log(user);
                        if (user) {
                            var mensagem = "";
                            if (x.name) {
                                mensagem = "".concat(x.name, " cochichou para voce - ").concat(mensagem1_1);
                            }
                            else {
                                mensagem = "".concat(x.address, ":").concat(x.port, " cochichou - ").concat(mensagem1_1);
                            }
                            server.send(mensagem, 0, mensagem.length, user.port, user.address);
                            server.send("\nCochicho enviado!", rinfo.port);
                        }
                        else {
                            server.send("\nUsuario: ".concat(param2, " nao encontrado"), rinfo.port);
                        }
                    }
                });
            }
            else {
                server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
            }
            break;
        case "ajuda":
            server.send(ajuda(), rinfo.port);
            break;
        case "setarnome":
            var client_1 = clients.filter(function (x) { return x.address == rinfo.address && x.port == rinfo.port; })[0];
            var index = clients.indexOf(client_1);
            clients[index].name = msg.toString().split(":")[1].trim();
            server.send("\nNome setado para: ".concat(clients[index].name), rinfo.port);
            break;
        case "nome":
            client_1 = clients.filter(function (x) { return x.address == rinfo.address && x.port == rinfo.port; })[0];
            server.send("\nSeu nome eh: ".concat(client_1.name), rinfo.port);
            break;
        default:
            server.send("\nComando invalido digite 'ajuda:' pra ver a lista de comandos", rinfo.port);
    }
});
server.on('listening', function () {
    var address = server.address();
    console.log("server listening ".concat(address.address, ":").concat(address.port));
});
server.bind(3000);
