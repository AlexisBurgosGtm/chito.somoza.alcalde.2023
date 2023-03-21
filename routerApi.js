const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/nuevocliente", async(req,res)=>{

    const{sucursal,codven,fecha,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long} = req.body;

    let qry = `INSERT INTO ME_CENSO (
            CODSUCURSAL,   CODVEN,     FECHA, CODCLIE,NITCLIE,TIPONEGOCIO,NEGOCIO,NOMCLIE,DIRCLIE,REFERENCIA,CODMUN,CODDEPTO,OBS,VISITA,LAT,LONG,TELEFONO, STATUS)
    VALUES ('${sucursal}',${codven},'${fecha}',0,'${nitclie}','${tiponegocio}','${negocio}','${nomclie}','${dirclie}','${referencia}','${codmun}','${coddepto}','${obs}','${visita}',${lat},${long},'${telefono}','PENDIENTE');`
    
    console.log(qry);
    
     execute.Query(res,qry);
     
});


router.get("/listaclientes", async(req,res)=>{

    const{sucursal,codven,visita} = req.query;

    let qry = `SELECT ME_CENSO.CODSUCURSAL, ME_CENSO.CODVEN, ME_CENSO.FECHA, ME_CENSO.ID AS CODCLIE, ME_CENSO.NITCLIE,ME_CENSO.TIPONEGOCIO, ME_CENSO.NEGOCIO, ME_CENSO.NOMCLIE, ME_CENSO.DIRCLIE, ME_CENSO.CODMUN, 
    ME_CENSO.CODDEPTO, ME_CENSO.REFERENCIA, ME_CENSO.OBS, ME_CENSO.VISITA, ME_CENSO.LAT, ME_CENSO.LONG, ME_CENSO.TELEFONO, ME_Municipios.DESMUNI AS MUNICIPIO, ME_Departamentos.DESDEPTO AS DEPARTAMENTO, ME_CENSO.STATUS
    FROM ME_CENSO LEFT OUTER JOIN
    ME_Departamentos ON ME_CENSO.CODDEPTO = ME_Departamentos.CODDEPTO AND ME_CENSO.CODSUCURSAL = ME_Departamentos.CODSUCURSAL LEFT OUTER JOIN
    ME_Municipios ON ME_CENSO.CODMUN = ME_Municipios.CODMUNI AND ME_CENSO.CODSUCURSAL = ME_Municipios.CODSUCURSAL
     WHERE ME_CENSO.CODSUCURSAL='${sucursal}' AND ME_CENSO.CODVEN=${codven} AND ME_CENSO.VISITA='${visita}'; `

     execute.Query(res,qry);
     
});

router.get("/datoscliente", async(req,res)=>{

    const{sucursal,codven,codclie} = req.query;

    let qry = `SELECT * FROM ME_CENSO WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven} AND CODCLIE='${codclie}'; `

     execute.Query(res,qry);
     
});

router.post("/editarcliente", async(req,res)=>{

    const{sucursal,codven,fecha,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,referencia,codmun,coddepto,obs,visita,lat,long,telefono} = req.body;

    let qry = `UPDATE ME_CENSO SET CODVEN=${codven},FECHA='${fecha}',NITCLIE='${nitclie}',TIPONEGOCIO='${tiponegocio}',NEGOCIO='${negocio}',NOMCLIE='${nomclie}',
    TELEFONO='${telefono}',DIRCLIE='${dirclie}',CODMUN='${codmun}',CODDEPTO='${coddepto}', 
    REFERENCIA='${referencia}',OBS='${obs}',VISITA='${visita}',LAT=${lat},LONG=${long}
     WHERE CODSUCURSAL='${sucursal}' AND ID=${codclie}; `//CODCLIE=${codclie}; 

     execute.Query(res,qry);
     
});

router.post("/deletecliente", async(req,res)=>{

    const{sucursal,codclie} = req.body;

    let qry = `DELETE FROM ME_CENSO WHERE CODSUCURSAL='${sucursal}' AND CODCLIE=${codclie};`

     execute.Query(res,qry);
     
});


router.get("/municipios", async(req,res)=>{

    const{sucursal} = req.query;

    let qry = `SELECT CODMUNI, DESMUNI FROM ME_MUNICIPIOS WHERE CODSUCURSAL='${sucursal}'; `

     execute.Query(res,qry);
     
});

router.get("/departamentos", async(req,res)=>{

    const{sucursal} = req.query;

    let qry = `SELECT CODDEPTO, DESDEPTO FROM ME_DEPARTAMENTOS WHERE CODSUCURSAL='${sucursal}'; `

     execute.Query(res,qry);
     
});


router.post("/verificar", async(req,res)=>{

    const{sucursal,codclie} = req.body;

    let qry = `SELECT CODCLIE FROM ME_CENSO WHERE CODSUCURSAL='${sucursal}' AND CODCLIE=${codclie};`

     execute.Query(res,qry);
     
});

module.exports = router;

