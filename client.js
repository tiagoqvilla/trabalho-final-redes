const dgram = require("dgram");
const PORT = 3000;
const HOST = '127.0.0.1';
var stdin = process.openStdin();


stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    // console.log("you entered: [" +
    //     d.toString().trim() + "]");
    client.send(d.toString().trim(), 0, d.toString().trim().length, PORT, HOST, function (err, bytes) {
        if (err) {
            console.error(`UDP message send error:`, err);
        } else {
            console.log(`UDP message sent to ${HOST}:${PORT}`);
        }
    });
});


const message = Buffer.from("Hey there!!", "utf8");

const client = dgram.createSocket('udp4');

client.on("message", function (message, remote) {
    console.log(`UDP message received from: ${remote.address}:${remote.port} - ${message}`);
});

client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
    if (err) {
        console.error(`UDP message send error:`, err);
    } else {
        console.log(`UDP message sent to ${HOST}:${PORT}`);
    }
});