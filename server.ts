const dgram = require("dgram");
const server = dgram.createSocket('udp4');
const Overlap = require('overlap')
const Couleurs = require('couleurs')
const Box = require('cli-box')

export class client {
  public address: string;
  public family: string;
  public port: number;
  public size: number;
  public name?: string;
  public inventario?: item[];
  public actualRoom: room;
  public actualRoomIndex: number;
}

export class item {
  public name: string;
  public isKey: boolean;
  public isSword: boolean;
  public isEnemy: boolean;
  public life?: number;
  public description: string;

  constructor(name: string, isKey: boolean, isSword: boolean, isEnemy: boolean, description: string, life?: number) {
    this.name = name;
    this.isKey = isKey;
    this.isSword = isSword;
    this.isEnemy = isEnemy;
    this.life = life;
    this.description = description;
  }
}

export class enemy {
  name: string;
  life: number;

  constructor(name: string, life: number) {
    this.name = name;
    this.life = life;
  }
}

export class room {
  public id: number;
  public name: string;
  public users?: client[];
  public objects: item[];
  public isOpen: boolean;
  public adjacentRooms: adjacentRoom[];
  public description: string;

  constructor(id: number, name: string, users: client[], objects: item[], isOpen: boolean, adjacentRooms: adjacentRoom[], description: string) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.objects = objects;
    this.isOpen = isOpen;
    this.adjacentRooms = adjacentRooms;
    this.description = description;
  }

  public examinar() {
    return `Voce esta na sala: ${this.name}
    \nA sala esta: ${this.roomIsOpen()}
    \nAs salas adjacentes e suas posicoes sao:${this.getSalas()}
    \nOs itens presentes nela sao:${this.getItems()}
    \nOs jogadores presentes nela sao:${this.getUsers()}`;
  }

  public roomIsOpen(): string {
    return this.isOpen ? "Aberta" : "Fechada";
  }
  
  public getUsers() {
    let usuarios = ""
    this.users.forEach(x => {
      if (x.name) {
        usuarios = `${usuarios} | ${x.name}`
      } else {
        console.log(x.address, x.port);
        usuarios = `${usuarios} | ${x.address}:${x.port}`
      }
    })
    return usuarios;
  }

  public setOpen() {
    this.isOpen = true;
  }

  public getSalas(): string {
    if (this.adjacentRooms.length > 0) {
      let salas = ""
      this.adjacentRooms.forEach(x => {
        salas = `${salas} | ${x.name} na posicao ${x.position}`
      })
      return salas;
    } else {
      return "Nenhuma sala adjacente!";
    }
  }

  public getItems(): string {
    if (this.objects.length > 0) {
      let items = ""
      this.objects.forEach(x => {
        items = `${items} | ${x.name}`
      })
      return items;
    } else {
      return "Nenhum item!";
    }
  }
}

export class adjacentRoom {
  public id: number;
  public position: string;
  public name: string;

  constructor(id: number, position: string, name: string) {
    this.id = id;
    this.position = position;
    this.name = name;
  }
}

var clients: client[] = [];
var key = new item("Chave", true, false, false, "Chave: pode ser utilizada para abrir qualquer sala, basta digitar a posicao em que a porta da sala esta, por exemplo usar: Chave Sala2");
var sword = new item("Espada", false, true, false, "Espada: pode ser utilizada para atacar seus inimigos");
var dragon = new item("Dragao", false, false, true, "Dragao: ele eh seu inimigo", 30);
var nameRoom1 = 'Sala1';
var nameRoom2 = 'Sala2';
var nameRoom3 = 'Sala3';
var nameRoom4 = 'Sala4';
var nameRoom5 = 'Sala5';

var room1 = new room(1, nameRoom1, [], [key, sword], true, [new adjacentRoom(3, "L", nameRoom3)], "sala poderosa")
//deixar todas como false
var room2 = new room(2, nameRoom2, [], [key], false, [new adjacentRoom(3, "N", nameRoom3)], "sala poderosa 2")
var room3 = new room(3, nameRoom3, [], [key, sword], false, [new adjacentRoom(4, "N", nameRoom4), new adjacentRoom(1, "O", nameRoom1), new adjacentRoom(2, "S", nameRoom2)],"sala poderosa 3")
var room4 = new room(4, nameRoom4, [], [key], false, [new adjacentRoom(3, "S", nameRoom3), new adjacentRoom(5, "L", nameRoom5)], "sala poderosa 4")
var room5 = new room(5, nameRoom5, [], [dragon], false, [new adjacentRoom(4, "O", nameRoom4)], "sala poderosa 5")
var rooms = [room1, room2, room3, room4, room5];

let generatedRooms = []
let marksConfigs = {
  nw: '╔',
  n: '═',
  ne: '╗',
  e: '║',
  se: '╝',
  s: '═',
  sw: '╚',
  w: '║',
}

const generateRooms = (rooms: room[], address: string, port: number) => {
  rooms.forEach(room => {
    let player = room.users.filter(x => x.port == port && x.address == address)[0] ? 'X' : '';
    let box = Box(
      {
        w: 10,
        h: 2,
        marks: marksConfigs,
      },
      Couleurs(player, '#c0392b')
    )
    generatedRooms.push(box)
  })
}

/**
 * Printa o mapa contendo a posição atual do jogador
 * @param {string} currentPlayer
 */
const printMap = (rooms: room[], address: string, port: number) => {
  generatedRooms = [];
  generateRooms(rooms, address, port)

  let outerBox = Box(
    {
      w: 5,
      h: 20,
      fullscreen: true,
      marks: marksConfigs,
    },
    {
      text: Couleurs('Localização Atual do Jogador', [255, 255, 0]),
      vAlign: 'top',
      hAlign: 'right',
    }
  )

  // Sala 1
  let currentMap = Overlap({
    who: outerBox,
    with: generatedRooms[0],
    where: {
      x: 50,
      y: 5,
    },
  })

  // Sala 2
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[1],
    where: {
      x: 60,
      y: 9,
    },
  })

  // Sala 3
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[2],
    where: {
      x: 60,
      y: 5,
    },
  })

  // Sala 4
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[3],
    where: {
      x: 60,
      y: 1,
    },
  })

  // Sala 5
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[4],
    where: {
      x: 70,
      y: 1,
    },
  })
  server.send(currentMap, port);
}

const ajuda = () => {
  return `${Couleurs("Lista de comandos disponiveis:", "#2980b9")} \n
  ${Couleurs("mapa", [255, 255, 0])} -- Exibe o mapa da localização atual do jogador\n
  ${Couleurs("examinar: [objeto/sala]", [255, 255, 0])} -- Examina o objeto, sala atual ou verifica se a porta da sala adjacente esta aberta ou fechada.\n
  ${Couleurs("mover: [N/S/L/O]", [255, 255, 0])} -- Move o jogador para uma sala\n
  ${Couleurs("pegar: [objeto]", [255, 255, 0])} -- Coleta um objeto contido na sala atual\n
  ${Couleurs("largar: [objeto]", [255, 255, 0])} -- Larga um objeto contido no inventário do jogador\n
  ${Couleurs("inventario", [255, 255, 0])} -- Exibe o seu inventario\n
  ${Couleurs("usar: [objeto] {alvo}", [255, 255, 0])} -- Usa um objeto. Alguns objetos podem ser usados em alvos específicos\n
  ${Couleurs("falar: [texto]", [255, 255, 0])} -- Envia uma mensagem de texto para todos os jogadores presentes na sala atual\n
  ${Couleurs(`cochichar: "[texto]" [jogador]`, [255, 255, 0])} -- Envia uma mensagem de texto para um jogador específico na sala atual\n
  ${Couleurs(`setarnome: [nome]`, [255, 255, 0])} -- Seta um nome para voce uilizar\n
  ${Couleurs(`nome:`, [255, 255, 0])} -- Exibe seu nome atual\n
  ${Couleurs("ajuda", [255, 255, 0])} -- Lista todos os comandos possíveis do jogo\n
  `
}

server.on('error', (err) => {
  console.log(`server error:`, err);
  server.close();
});

server.on('message', (msg: string, rinfo: client) => {
  if (clients.length > 0) {
    var ports: number[] = [];
    clients.forEach(client => {
      ports.push(client.port);
    })
    if (!ports.includes(rinfo.port)) {
      clients.push(rinfo);
    }
  } else {
    clients.push(rinfo);
  }

  var command = msg.toString().split(":")[0].toLowerCase();
  switch (command) {
    case "welcome":
      server.send(`Bem vindo ao servidor!\n\n O seu objetivo eh chegar ate o poderoso dragao, para isso voce precisara encontrar meios para acessar as outras salas e tambem encontrar uma forma de matar o dragao.\n Boa sorte!`, rinfo.port);
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          rooms[0].users.push(x);
          x.actualRoom = rooms[0];
          x.actualRoomIndex = 0;
          server.send(rooms[0].examinar(), rinfo.port);
        }
      })

      break;
    case "examinar":
      let object = msg.toString().split(":")[1];
      if (object) {
        object = object.trim();
        clients.forEach(x => {
          if (x.port == rinfo.port && x.address == rinfo.address) {
            if (object == rooms[x.actualRoomIndex].name) {
              server.send(rooms[x.actualRoomIndex].examinar(), rinfo.port);
            } else if (rooms[x.actualRoomIndex].adjacentRooms.filter(x => x.name == object)[0]) {
              const room = rooms[x.actualRoomIndex].adjacentRooms.filter(x => x.name == object)[0];
              rooms.forEach(xs => {
                if (xs.name == room.name)  {
                  server.send(`A porta da sala adjacente: ${xs.name} esta: ${xs.roomIsOpen()}`, rinfo.port);
                }
              })
            } else if (rooms[x.actualRoomIndex].objects.filter(ys => ys.name == object)[0] || x.inventario?.filter(zs => zs.name == object)[0]) {
              let description = "";
              rooms[x.actualRoomIndex].objects.forEach(ys => {
                if (ys.name == object) {
                  description = ys.description;
                }
              })

              if (x.inventario) {
                x.inventario.forEach(ys => {
                  if (ys.name == object) {
                    description = ys.description;
                  }
                })
              }
              server.send(description, rinfo.port)
            } else {
              server.send(`O item ${object} nao foi encontrado na sala ou em seu inventario!`, rinfo.port)
            }
          }
        });
      } else {
        server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
      }
      break;
    case "mover":
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          const avaiablePositions = [];
          const movePosition = msg.toString().split(":")[1].trim().toUpperCase();
          x.actualRoom.adjacentRooms.forEach(x => {
            avaiablePositions.push(x.position);
          })

          if (avaiablePositions.includes(movePosition)) {
            let destinationRoom = 0;

            x.actualRoom.adjacentRooms.forEach(x => {
              if (movePosition == x.position) {
                destinationRoom = x.id;
              }
            })
            let destinationRoomIndex = 0;
            rooms.map((item, index) => {
              if (destinationRoom == item.id) {
                destinationRoomIndex = index;
              }
            })
            let userIndex = 0;
            rooms[x.actualRoomIndex].users.map((item, index) => {
              if (x.port == item.port && x.address == item.address) {
                userIndex = index;
              }
            });

            if (rooms[destinationRoomIndex].isOpen) {
              rooms[x.actualRoomIndex].users.splice(userIndex, 1);
              x.actualRoom = rooms[destinationRoomIndex];
              x.actualRoomIndex =  destinationRoomIndex;
              rooms[destinationRoomIndex].users.push(x)
              server.send(`\nVoce se moveu para sala: ${rooms[destinationRoomIndex].name}`, rinfo.port);
              server.send(rooms[destinationRoomIndex].examinar(), rinfo.port);
            } else {
              server.send('\nA porta dessa sala esta fechada, voce precisa abrir ela usando uma chave', rinfo.port);
            }
          } else {
            server.send("\nVoce tentou ir para uma posicao que nao eh valida, examine a sala para saber os caminhos", rinfo.port);
          }
        }
      });
      break;
    case "pegar":
      var objeto = msg.toString().split(":")[1].trim();
      if (objeto == "Dragao") {
        server.send(`\nVoce nao pode pegar o objeto Dragao!`, rinfo.port);
        return
      }
      let objetoPego = null;
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          rooms[x.actualRoomIndex].objects.map((obj, index) => {
            if (obj.name == objeto && !obj.isEnemy) {
              objetoPego = obj;
              if (!x.inventario) {
                x.inventario = [];
              }
              if (x.inventario.filter(item => item.name == objetoPego.name)[0]) {
                server.send(`\nVoce ja tem o item ${objetoPego.name} no seu inventario`, rinfo.port);
              } else {
                x.inventario.push(obj);
                var restantes = [];
                rooms[x.actualRoomIndex].objects.forEach(x => {
                  if (x.name != obj.name) {
                    restantes.push(x);
                  }
                })
                rooms[x.actualRoomIndex].objects = restantes;
                server.send(`\nVoce pegou o objeto: ${obj.name}!`, rinfo.port);
              }
            }
          })
        }
      });
      if (!objetoPego) {
        server.send(`\nO item ${objeto} nao existe na sala!`, rinfo.port);
      }
      break;
    case "largar":
      var objeto = msg.toString().split(":")[1].trim();
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          if (x.inventario) {
            if (x.inventario.filter(x => x.name == objeto)[0]) {
              if (rooms[x.actualRoomIndex].objects.filter(obj => obj.name == objeto)[0]) {
                server.send(`\nVoce nao pode largar o item ${objeto} aqui pois ja existe esse item nessa sala!`, rinfo.port);
              } else {
                const itensRestantesInventario = [];
                x.inventario.forEach(inv => {
                  console.log(inv);
                  if (inv.name != objeto) {
                    itensRestantesInventario.push(inv);
                  } else {
                    server.send(`\nVoce largou o item: ${inv.name}`, rinfo.port);
                    rooms[x.actualRoomIndex].objects.push(inv);
                  }
                });
                x.inventario = itensRestantesInventario;
              }
            } else {
              server.send(`\nVoce nao tem o item: ${objeto} no seu invetario para largar`, rinfo.port);
            }
          } else {
            server.send(`\nVoce nao tem o item: ${objeto} no seu invetario para largar`, rinfo.port);
          }
        }
      });
      break;
    case "inventario":
      let itemsInventario = "\nItens no seu inventario:";
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          if (x.inventario) {
            x.inventario.forEach(item => {
              itemsInventario = `${itemsInventario} ${item.name} |`;
            })
            if (!x.inventario.length) {
              itemsInventario = "\nVoce nao tem nenhum item no inventario!";
            }
          } else {
            itemsInventario = "\nVoce nao tem nenhum item no inventario!";
          } 
        }
      });
      server.send(itemsInventario, rinfo.port);
      break;
    case "usar":
      var params = msg.toString().split(":")[1].trim();
      var param1 = params.split(" ")[0];
      var param2 = params.split(" ")[1];
      if (param1 && param2) {
        clients.forEach(x => {
          if (x.port == rinfo.port && x.address == rinfo.address) {
            if (x.inventario) {
              var item = x.inventario.filter(inv => inv.name == param1)[0];
              if (item) {
                if (item.isKey) {
                  var salas = [];
                  rooms[x.actualRoomIndex].adjacentRooms.forEach(sala => {
                    salas.push(sala.name);
                  })

                  if (salas.includes(param2)) {
                    rooms.forEach(sala => {
                      if (sala.name == param2) {
                        if (sala.isOpen) {
                          server.send(`\nA: ${param2} ja esta aberta!`, rinfo.port);
                        } else {
                          sala.setOpen();
                          server.send(`\nVoce abriu a porta da: ${param2}`, rinfo.port);
                        }
                      }
                    })
                  } else {
                    server.send(`\nVoce nao pode usar o item: ${param1} no objeto: ${param2}`, rinfo.port);
                  }
                }
                if (item.isSword) {
                  if (param2 == "Dragao") {
                    rooms[x.actualRoomIndex].objects.forEach(xs => {
                      if (xs.name == param2) {
                        if (xs.life == 30) {
                          xs.life = xs.life - 10;
                          server.send(`\nVoce golpeia o poderoso Dragao usando a sua ${param1}, mas nao eh o suficiente para mata-lo`, rinfo.port);
                        } 
                        else if (xs.life == 20) {
                          xs.life = xs.life - 10;
                          server.send(`\nVoce acerta o Dragao em cheio e ele cai no chao, apenas mais um golpe e sua missao estara finalizada`, rinfo.port);
                        } 
                        else if (xs.life == 10) {
                          xs.life = xs.life - 10;
                          server.send(`\nVoce pega sua ${param1} chega perto do Dragao e da o ultimo golpe nele, ele solta um enorme rugido e morre!`, rinfo.port);
                          server.send(`\nParabens voce desbravou este mundo e concluiu seu objetivo de matar o dragao!`, rinfo.port);
                        } 
                        else if (xs.life == 0) {
                          server.send("\nO Dragao ja esta morto!", rinfo.port)
                        }
                      }
                    })
                  } else {
                    server.send(`\nVoce nao pode usar o item: ${param1} no objeto: ${param2}`, rinfo.port);
                  }
                }
              } else {
                server.send(`\nVoce nao tem o item: ${param1} no seu inventario, para ver os itens do seu inventario digite inventario:`, rinfo.port);
              }
            } else {
              server.send(`\nVoce nao tem o item: ${param1} no seu inventario, para ver os itens do seu inventario digite inventario:`, rinfo.port);
            }
          }
        }); 
      } else {
        server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
      }
      break;
    case "falar":
      var message = msg.toString().split(":")[1];
      clients.forEach(x => {
        if (x.port == rinfo.port && x.address == rinfo.address) {
          if (rooms[x.actualRoomIndex].users) {
            rooms[x.actualRoomIndex].users.forEach(current => {
              server.send(message, 0, message.length, current.port, current.address);
            })
          }
        }
      })
      break;
    case "mapa": 
      printMap(rooms, rinfo.address, rinfo.port);
      break;
    case "cochichar":
      var params = msg.toString().split(":")[1].trim();
      const mensagem1 = /"(.*?)"/.exec(params)[1];
      var param2 = params.replace(`"${mensagem1}"`, "").trim();
      if (msg.toString().split(":")[2]) {
        var param2 = params.replace(`"${mensagem1}"`, "").trim() + ":" + msg.toString().split(":")[2].trim();
      }
      console.log(param2)
      if (mensagem1 && param2) {
        clients.forEach(x => {
          if (x.port == rinfo.port && x.address == rinfo.address) {
            var user = rooms[x.actualRoomIndex].users.filter(xs => xs.name == param2 || `${xs.address}:${xs.port}` == param2)[0];
            console.log(user);
            if (user) {
              let mensagem = "";
              if (x.name) {
                mensagem = `${x.name} cochichou para voce - ${mensagem1}`;
              } else {
                mensagem = `${x.address}:${x.port} cochichou - ${mensagem1}`;
              }
              server.send(mensagem, 0, mensagem.length, user.port, user.address);
              server.send(`\nCochicho enviado!`, rinfo.port);
            } else {
              server.send(`\nUsuario: ${param2} nao encontrado`, rinfo.port);
            }
          }
        })
      } else {
        server.send("\nComando invalido, para ver a forma correta de uso utilize o comando ajuda:", rinfo.port);
      }
      break;
    case "ajuda":
      server.send(ajuda(), rinfo.port);
      break;
    case "setarnome":
      let client = clients.filter(x => x.address == rinfo.address && x.port == rinfo.port)[0];
      const index = clients.indexOf(client);
      clients[index].name = msg.toString().split(":")[1].trim();
      server.send(`\nNome setado para: ${clients[index].name}`, rinfo.port);
      break;
    case "nome": 
      client = clients.filter(x => x.address == rinfo.address && x.port == rinfo.port)[0];
      server.send(`\nSeu nome eh: ${client.name}`, rinfo.port);
    break;
    default:
      server.send("\nComando invalido digite 'ajuda:' pra ver a lista de comandos", rinfo.port);
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3000);