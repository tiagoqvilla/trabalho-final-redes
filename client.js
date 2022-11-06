const dgram = require("dgram");
const PORT = 3000;
const HOST = '127.0.0.1';
var stdin = process.openStdin();
const message = Buffer.from("welcome: Hey there!!", "utf8");
const client = dgram.createSocket('udp4');

stdin.addListener("data", function (d) {
    client.send(d.toString().trim(), 0, d.toString().trim().length, PORT, HOST, function (err, bytes) {
        if (err) {
            console.error(`UDP message send error:`, err);
        }
    });
});

client.on("message", function (message, remote) {
    console.log(`${message}`);
});

client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
    if (err) {
        console.error(`UDP message send error:`, err);
    } else {
        console.log(`UDP message sent to ${HOST}:${PORT}`);
    }
});