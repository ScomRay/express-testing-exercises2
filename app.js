const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usuario ={
  nombre: '', 
  apellido: ''
};

let respuesta = {
  error: false, 
  codigo: 200,
  mensaje: 'OK'
}

app.get('/', (req, res) =>{
  res.send(respuesta);
});

app.get('/usuario', (req, res)=>{
  if (usuario.nombre === '' || usuario.apellido === '') {
    respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'El usuario no ha sido creado'
    } 
  } else {
    respuesta = {
      error: false,
      codigo: 200, 
      mensaje: 'Este es el usuario',
      respuesta: usuario
    };
  }
  res.send(respuesta);
})
app.post('/usuario',(req, res) => {
  if(!req.body.nombre || !req.body.apellido) {
    respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'El campo nombre y apellido son requeridos'
    };
  } else {
    if (usuario.nombre !== '' || usuario.apellido !== ''){
      respuesta = {
        error: true,
        codigo: 503,
        mensaje: 'El usuario ya se creo '
      };
    } else {
      usuario = { 
        nombre: req.body.nombre,
        apellido: req.body.apellido
      };
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Usuario creado',
        respuesta: usuario
      };
    };
  };
  res.send(respuesta)
});
app.put('/usuario',(req, res) => {
  if(!req.body.nombre || !req.body.apellido) {
    respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'El campo nombre y apellido son requeridos'
    };
  } else {
    if (usuario.nombre === '' || usuario.apellido === ''){
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'El usuario no ha sido creo '
      };
    } else {
      usuario = { 
        nombre: req.body.nombre,
        apellido: req.body.apellido
      };
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Usuario Actualizado',
        respuesta: usuario
      };
    };
  };
  res.send(respuesta)
});

app.delete('/usuario',(req, res) => {
  if(usuario.nombre === '' || usuario.apellido === '') {
    respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'El usuario no ha sido creado'
    };
  } else {
    usuario = {
      nombre: '',
      apellido: ''
    }
    respuesta = {
      error: false, 
      codigo: 200,
      mensaje:'Usuario eliminado'
    }
  };
  res.send(respuesta)
});

//Params
//http://localhost:3000/user/1912 <--- el id
app.get('/user/:uid',(req,res) => {
  console.log(req.params);
  const uid = req.params.uid
  //const {uid} = req.params
  res.send({message:`Id buscado: ${uid}`})
});

//Querys
//http://localhost:3000/search?q=gatos&color=negro&vidas=6
app.get('/search',(req,res)=> {
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;
    console.log(nombre);
    console.log(apellido);
    if (nombre !== usuario.nombre || apellido !== usuario.apellido) {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'El usuario no ha sido creado'
      }
    } else {
      respuesta = {
        error: false,
        codigo: 200, 
        mensaje: 'Usuario encontrado',
        respuesta: usuario
      };
    };
    res.send(respuesta);
});



app.get('/api/swapi/:people', (req, resp) => {
    const {people} = req.params;
    request.get(`https://swapi.co/api/people/${people}/`, (err, res, body) => {
        const swapi_res = JSON.parse(body);
        let films = [];
        swapi_res.films.forEach(film => {
          Promise.all (
            request.get(`${film}`, (err, req, body)=>{ 
            const swapi_film = JSON.parse(body);
            let film = {
              id: swapi_film.episode_id, 
              title: swapi_film.title
              }
            })
          )
          resp.status(200).send({ 'personaje': swapi_res }); 
        });
    });
});  

app.use((req, res, next)=> {
  respuesta = {
    error: true, 
    codigo: 404, 
    mensaje: 'Not found'
  }
  res.status(404).send(respuesta)
})

app.listen(4000, () => {
  console.log("Start server in port 4000 ");
});