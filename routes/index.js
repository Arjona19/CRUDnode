var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var db = require("../conexion/conexion");
var fs = require('fs');

//router.use(express.static('public'));

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'../public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CRUD con Node' });
});

//Gestion usuarios
router.get('/gestionUsuario', function (req, res, next) {
  db.query("SELECT * FROM usuario", function (err, resultados) {
    res.render('gestionUsuario', { title: 'Gestión de usuarios', Usuarios: resultados });
  });
});

//Agregar usuarios
router.get('/agregarUsuario', function (req, res, next) {
  res.render('agregarUsuario', { title: 'Agregar usuarios' });
});

router.post('/agregarUsuario/save', upload.single('foto'), function (req, res, next) {
  const { nombre, apellido, sexo } = req.body;
  var imagen = req.file.filename;
  const data = {
    nombre,
    apellido,
    sexo,
    foto: imagen
  };
  db.query('INSERT INTO usuario set ?', [data]);
  res.redirect('/agregarUsuario');
});

//Editar usuarios
router.get('/gestionUsuario/editar/:idusuario/', function (req, res, next) {
  const { idusuario } = req.params;
  db.query("SELECT * FROM usuario WHERE idusuario = " + idusuario, function (err, rows) {
    res.render('editarUsuario', { title: 'Edición de usuarios', data: rows });
  });
});

router.post('/editarUsuario/editar/:idusuario/:foto', upload.single('foto'), function (req, res, next) {
  const { idusuario, foto } = req.params;
  fs.unlink('../public/images/'+[foto], (error) => {
    if (error) {
      throw error;
    }
    console.log('Imagen eliminada');
  });
  const { nombre, apellido, sexo } = req.body;
  var imagen = req.file.filename;
  const data = {
    nombre,
    apellido,
    sexo,
    foto: imagen
  };
  db.query('UPDATE usuario set ? where idusuario = ?', [data, idusuario]);
  res.redirect('/gestionUsuario');
});

//Eliminar usuarios
router.get('/gestionUsuario/eliminar/:idusuario/:foto', function (req, res, next) {
  const { idusuario, foto } = req.params;
  fs.unlink('../public/images/'+[foto], (error) => {
    if (error) {
      throw error;
    }
    console.log('Imagen eliminada');
  });
  db.query('DELETE FROM usuario WHERE idusuario = ?', [idusuario]);
  res.redirect('/gestionUsuario');
});

module.exports = router;
