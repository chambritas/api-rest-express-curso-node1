const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger=require('./logger');
const morgan=require('morgan');
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(logger);

app.use(morgan('tiny'));

//Trabajos con la BD




//Configuracion de entorno
console.log('Aplicacion: '+ config.get('nombre'));
console.log('BD Server: '+ config.get('configDB.host')); 

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morgan está habilitado');
}
debug('Conectando con la base de datos...');

//console.log('Morgan habilitado...');
// app.use(function(req,res,next){
//     console.log('Autenticando...');
//     next();
// });

const usuarios = [
    { id: 1, nombre: 'Grover' },
    { id: 2, nombre: 'Pablo' },
    { id: 3, nombre: 'Chava' }
];


app.get('/', (req, res) => {
    res.send('Hola mundo express');
});

app.get('/api/usuarios', (req, res) => {
    //res.send(['Grover', 'Pablo', 'Chava']);
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) res.status(404).send('Usuario no encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    const { error, value } = schema.validate({ nombre: req.body.nombre });
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje);
    }
    /*if(!req.body.nombre || req.body.nombre.length<=2){
       res.status(400).send('Debe ingresar un nombre mínimo 3 digitos');
       return;
   }*/


});

/*app.get('/api/usuarios/:year/:mes',(req,res)=>{
    res.send(req.query);
});*/

const port = process.env.PORT || 3060;

app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}...`)
});