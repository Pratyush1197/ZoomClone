const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
    debug:true
});
app.use('/peerjs',peerServer)
app.set('view-engine', 'ejs');

app.use(express.static('public'))
app.get('/',(req,res) => {
   // if (Object.keys(io.sockets.clients().connected).length > 1)   {      res.redirect('www.google.com/')  } else{ console.log(Object.keys(io.sockets.clients().connected).length)
    res.redirect(`/${uuidv4()}`);
 
// }
})

app.get('/:room',(req,res) => {
    res.render('room.ejs', {roomId: req.params.room})
})
app.get('/error', (req,res) => {
    res.render('error')
    return
})

io.on('connection', socket => {
    
  // console.log(io.sockets.clients().connected)
    
    socket.on('join-room', (roomId,userid)=> {
    
        
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connect',userid)      
    
    socket.on("chat-message", data => {
        if (userid != undefined){       
        io.to(roomId).emit('createMessage',data)
        }
        
        })
    });    

})

server.listen(3036)