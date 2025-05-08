const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Alumno = require('./models/Alumno');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de alumnos',
            version: '1.0.0',
            description: 'API para gestionar los alumnos'
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ]
    },
    apis: ['./app.js']
};

const app = express();
app.use(express.json());
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const MONGO_URI = 'mongodb+srv://myAtlasDBUser:lolos12345@myatlasclusteredu.xjpb3uv.mongodb.net/certus?retryWrites=true&w=majority&appName=myAtlasClusterEDU';

mongoose.connect(MONGO_URI).then(()=>{
    console.log('Se conecto exitosamente');
}).catch((err)=>{
    console.log('Error encontrado', err);
});

/**
 * @swagger
 * /alumnos:
 *  post:
 *      summary: Crea un nuevo alumno
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              example: Max Enrique
 *                          apellido:
 *                              type: string
 *                              example: Carrasco Huaripata
 *                          edad:
 *                              type: integer
 *                              example: 31
 *                          genero:
 *                              type: string
 *                              example: Masculino
 *                          carrera:
 *                              type: string
 *                              example: Ing. de sistemas
 *                          comentarios:
 *                              type: string
 *                              example: Este es un ejemplo de comentario
 *                      required:
 *                          - nombre
 *                          - apellido
 *                          - edad
 *                          - genero
 *                          - carrera
 *      responses:
 *          201:
 *              description: Alumno registrado correctamente
 *          400:
 *              description: Error al registrar alumno
 */
app.post('/alumnos', async (req, res)=> {
    try{
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        res.status(201).json({mensaje:'Alumno registrado exitosamente'});
    }catch(err){
        console.log(err);
        res.status(400).json({mensaje:'Error al registrar alumno'});
    }
});

/**
 * @swagger
 * /alumnos:
 *  get:
 *      summary: Obtiene todos los alumnos
 *      responses:
 *          200:
 *              description: Lista de alunnos
 *          400:
 *              description: Error al listar alumnos
 */
app.get('/alumnos', async (req, res)=> {
    try{
        const alumnos = await Alumno.find();
        res.status(200).json(alumnos);
    }catch(err){
        console.log(err);
        res.status(400).json({mensaje:'Error al listar alumnos'});
    }
});

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

app.listen(4000, ()=>{
    console.log('Se esta ejecutando en el puerto 4000...');
});