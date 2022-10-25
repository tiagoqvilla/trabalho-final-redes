// import dgram from 'dgram';
const dgram = require("dgram");
const server = dgram.createSocket('udp4');
var clients: client[] = [];
// var 

export class client {
  public address: string;
  public family: string;
  public port: number;
  public size: number;
  public name?: string;
  public inventario?: any[];
}

export class item {
  public name: string;
  public usableIn: item;
  public usableBy: item;
  public isCatchable: boolean;
  public life?: number;
}

export class room {
  public name: string;
  public users: client[];
  public objects: item[]
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
    console.log(clients)
  }

  var command = msg.toString().split(":")[0].toLowerCase();
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
      let client = clients.filter(x => x.address == rinfo.address && x.port == rinfo.port)[0];
      const index = clients.indexOf(client);
      clients[index].name = msg.toString().split(":")[1].trim();
      server.send(`Nome setado para: ${clients[index].name}`, rinfo.port);
      break;
    case "nome": 
      client = clients.filter(x => x.address == rinfo.address && x.port == rinfo.port)[0];
      server.send(`Seu nome eh: ${client.name}`, rinfo.port);
    break;
    default:
      server.send("Comando invalido digite 'ajuda:' pra ver a lista de comandos", rinfo.port);
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3000);