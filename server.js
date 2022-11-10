const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParse = require('body-parser')

app.use(bodyParse.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/static'))

app.set('views', __dirname + '/views')

app.set('view engine', 'ejs')

//*********************************** */
//* definimos la BD
mongoose.connect('mongodb://localhost/foroDB', {useNewUrlParser: true})

const ComentarioSchema = new mongoose.Schema({
    nombre: {type: String, require: [true, 'Nombre requerido'],},
    comentario: {type: String, require: [true, 'comentario requerido']},

})

const PosteoSchema = new mongoose.Schema({
    nombre: {type: String, require: [true, 'Nombre requerido'],},
    comentario: {type: String, require: [true, 'comentario requerido']},
    postcomentario: [ComentarioSchema]
})



const Posteo = mongoose.model('posteo', PosteoSchema)

//**************AQUI SE INGRESAN LOS POST********************** */

app.post('/mensaje', function(req, res) {
    console.log(req.body)
    const { nombre, comentario} = req.body
    const posteo = new Posteo()
    posteo.nombre = nombre
    posteo.comentario = comentario
    posteo.save()
    .then(
        () => res.redirect("/mensaje")
    )
    
    .catch (
        (error) =>{ console.log(error)
        },    
    )
})

app.post('/mensajecomment/:id', function(req, res) {
    console.log(req.body)
    
    Posteo.findOneAndUpdate
        ({_id: req.params.id}, {$push: {postcomentario: req.body}})
        
    .then(
        () => res.redirect("/mensaje")
    )
    
    .catch (
        (error) =>{ console.log(error)
        },    
    )
})


//******************************************************************* */
//**********AQUI SE CARGA EL FORO************************************** */

app.get('/mensaje', (req, res) => {
    
    Posteo.find({})
    
    .then(posteo => {
        res.render("mensaje",{existemsj: posteo, mensaje: " "})
        // lógica con otros resultados
    })
    .catch(err => res.json(err));
            
})




//******************************************************************* */

app.get('/mensaje', (req, res) => {

    res.render('mensaje', {mensaje: " "})
})

//********************************** */














app.listen(8000, function() {
    console.log ("listening in port 8000");
})