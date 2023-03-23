
var express = require("express");
var axios = require('axios');

var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 9500;

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

//-----------------------------
const FEL_URL_LOGIN = "https://felcloud-instance-three.feel.com.gt/api/v2/servicios/externos/login";
const FEL_URL_CONSULTARECEPTORES = 'https://consultareceptores.feel.com.gt/rest/action';
const FEL_URL_CUI = "https://felcloud-instance-three.feel.com.gt/api/v2/servicios/externos/cui";

const Rounder = (value) => {
  return Math.round((+value + 0.00001) * 100) / 100
}

const returnError = (err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).send(err)
}

const parseNit = (nit) => {
  let _nit = nit.replace('.', '')
  _nit = _nit.replace('-', '')
  _nit = _nit.replace('/', '')
  _nit = _nit.replace('.', '')
  return _nit.toUpperCase()
}

const parseSAT = (value) => {
  const _nombre = value.split(',')
  if (_nombre.length === 1 || _nombre.length === 2) {
    return Buffer.from(value,'utf-8').toString()
  } else {
    const _casada = (_nombre[2] !== '') ? ' DE ' + _nombre[2] : ''
    const final = _nombre[3] + ' ' + _nombre[4] + ' ' + _nombre[0] + ' ' + _nombre[1] + _casada
    return Buffer.from(final, 'utf-8').toString()   
	}
}

const fechaDiff = (fecha, fechaFinal) => {
  const fechaInicial = new Date(fecha)
  const fechaVence = new Date(fechaFinal)
  const diff = fechaVence.getTime() - fechaInicial.getTime()

  const fechaHoy = new Date()

  return new Date(fechaHoy.getTime() + diff)
}

const getDiff = (fecha) => {
  //const fecha = storage.getItem('token-vence')
  
  const date = new Date()
  const fechaVence = new Date(fecha)

  const diff = fechaVence.getTime() - date.getTime()

  return diff
}


const tokenInfile = async (fel_alias,fel_llave) => {
  try {
		const params = {
      prefijo: fel_alias,
      llave: fel_llave      
    }
		const postdata = new URLSearchParams(params)
		const { data, status } = await axios({
			url: FEL_URL_LOGIN,
			method: 'POST',
			data: postdata.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
    if (status === 200) {
      const { token, fecha_de_vencimiento, fecha } = data
      const fechaVence = fechaDiff(fecha, fecha_de_vencimiento)
			//redis.set('token-infile', token)
      //redis.set('token-vence', fechaVence)
      console.log('renovando token ', fechaVence)
      return Promise.resolve({
        status,
        data,
        token,
        fechaVence
      })
    } else {
      console.log('Axios Error')
      console.log(status, data)
      console.log('----')
			//redis.set('token-infile', null)
      //redis.set('token-vence', null)
      return Promise.resolve({
        status,
        data
      })
    }
  } catch (error) {
		console.log('error tokenfile ', error)
    return Promise.reject(error)
  }
}



//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------



app.post("/datosdpi", async function(req,res){
   
 const {dpi} = req.query;

  let cui = dpi;

  let fel_alias = '';
  let fel_llave = '';


  try {
   const { token } = await tokenInfile(fel_alias,fel_llave)
   let _token = token;
   
   //CONSULTA EL DPI

   const { data, status } = await axios({
     url: FEL_URL_CUI,
     method: 'POST',
     data: new URLSearchParams({ cui }).toString(),
     headers: {
       'Authorization': `Bearer ${_token}`,
       'Content-Type': 'application/x-www-form-urlencoded'
     }
   })    
   const nombre = (data.cui) ? data.cui.nombre : ''
   //return Promise.resolve(nombre.replace(',',''))
   res.send(nombre.replace(',',''))
  } catch (error) {
   console.log("🚀 ~ file: infileController.js:114 ~ error", error)
   //return Promise.reject(error)
   res.send('error: ' + error.toString());
 }
  

}); 
//--------------------------------------------------

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
