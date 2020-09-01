const net = require("net");
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const options = {
    host: 'localhost',
    port: 3000
}

const clientServer = net.connect(options, () => {
    console.log("Connection Established");
})

clientServer.on('data', (data) => {
    console.log(data.toString());
})

rl.on('line', (ip) => {
    clientServer.write(ip);
})

clientServer.on('error', (err) => {
    console.log('error');
})

clientServer.on('end', () => {
    console.log('Server Disconnected');
})