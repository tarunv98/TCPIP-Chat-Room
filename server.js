const net = require('net');
const CONSTANTS = require("./constants");

const server = net.createServer();

const options = {
    host: CONSTANTS.server_ID,
    port: CONSTANTS.server_PORT
}

let counter = 0;
const sockets = {};

server.on('connection', (socket) => {
    socket.id = getId(counter); // to give the user ID

    console.log(`A Client ${socket.id} is connected`);

    socket.write('||::::::::::::::::::::::::::::::::::::::::::::::::> CHAT ROOM <:::::::::::::::::::::::::::::::::::::::::::::|| \n Enter your name:(case sensitive) ');

    
    socket.on('data', (data) => { // gets executed whenever an user sends data

        if(!sockets[socket.id] || socket.name == ''){ // checks whether the user is connected and sending first data (name)
                socket.name = data.toString().trim();
                socket.write(`Welcome ${socket.name} \n`);
                availUsers(socket, sockets); // to display list of available users
                sockets[socket.id] = socket; // adds user to users list
                socket.write(':::INSTRUCTIONS::: \n 1. Use @<name> at the beginning of message to send a message privately \n 2. Use @chat HELP to display options \n');
                return;
        }
    
        console.log(`${socket.name} > ${data}`);

        if(data!='' && data.toString().indexOf('@')>=0){ // to check for '@' 
            console.log(`${data.toString().indexOf('@')} and name is ${data.toString().split('@')[1].split(' ')[0]}`);
            if(data.toString().split('@')[1].split(' ')[0]=='chat'){ // to display help
                socket.write(`asked for help ---- ${data.toString().split('@')[1].split(' ')[1]} \n`);
                chatTalk(data.toString().split('@')[1].split(' ')[1]);
                return;
            }
            Object.entries(sockets).forEach(([key, cs]) => { // to send a private message
                if(cs.name == data.toString().split('@')[1].split(' ')[0]){
                    cs.write(`${socket.name} to YOU: ${data.toString().split(`@${data.toString().split('@')[1].split(' ')[0]}`)[1]} \n`)
                }
            })
            return;
        }

        Object.entries(sockets).forEach(([key, cs]) => { // to broadcast a message
            if(key != socket.id){
                cs.write(`${socket.name} > ${data} \n`)
            }
        })

    });  
    
    socket.setEncoding('utf8');

    socket.on('end',data => {
        delete sockets[socket.id];
        Object.entries(sockets).forEach(([key, cs]) => {
            if(socket.id = key){
                cs.write(`${socket.name} has disconnected`);
            }
        })
        console.log(`${socket.name} has disconnected`);
    })
    
});

server.listen(options, () => {
    console.log('server has started');
});

function getId(id){
    
    for(let i = 0; i<=id; i++){
        if(!sockets[i]){
            if(i<id){return i;}
            counter++;
            return i;
        }
    }

}

function availUsers(socket, sockets){
    socket.write('available users: \n');
                Object.entries(sockets).forEach(([key, cs]) => {
                    socket.write(`${cs.id} > ${cs.name} \n`);
                })
}

function chatTalk(inst){
    if(inst.toString() === 'HELP' || inst.toString() === '')
    {
        socket.write(':::HELP:::');
        socket.write(':::INSTRUCTIONS::: \n 1. Use @<name> at the beginning of message to send a message privately \n 2. Use @chat <instruction> to talk to chat engine \n');
        socket.write('3. Use @chat help to view instructions \n >');
    }else if(inst.toString() === 'changename'){
        //change name
    }else{
        console.write('wrong option \n')
    }
    
}
