const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/nueva_solicitud", async(req,res)=>{

    const{dpi,nombre,solicitud,telefono} = req.body;

    let qry = `INSERT INTO POLITICA_SOLICITUDES (DPI,NOMBRE,SOLICITUD,TELEFONO,ST) 
    VALUES ('${dpi}','${nombre}','${solicitud}','${telefono}','P');`
    

    execute.Query(res,qry);
     
});



router.post("/nueva_inscripcion", async(req,res)=>{

    const{dpi,nombre,comunidad,telefono} = req.body;

    let qry = `INSERT INTO POLITICA_INSCRITOS (DPI,NOMBRE,COMUNIDAD,TELEFONO,PREMIO) 
    VALUES ('${dpi}','${nombre}','${comunidad}','${telefono}','NO');`

    execute.Query(res,qry);

    
});


module.exports = router;

