
var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000;

var api  = require('./routerApi');
var execute = require('./connection');


app.use(bodyParser.json());
app.use(express.static('build'));

var path = __dirname + '/'

router.use(function (req,res,next) {
    
    next();
});


app.get("/",function(req,res){
    res.sendFile(path + 'index.html');
}); 


app.use('/api', api);


app.use("/",router);


app.use("*",function(req,res){
  res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});

io.sockets.on('connection', function(socket){
    socket.on('peso', function(peso){
        //io.sockets.emit('peso',peso)
    });

    socket.on('disconnected', function(){
        console.log('disconnected');
    });
});



http.listen(PORT, function(){
    console.log('Servidor web iniciado en puerto:' + PORT);
});
