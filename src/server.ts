import express from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggeUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import router from './router'
import db from './config/db'

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.magenta.bold("Conexion Exitosa a la Base de datos"))

    } catch (error) {
        console.log(colors.red.bold("Hubo un error al conectarse a la BD"))
    }
}

connectDB()

const server = express()

// Permitir conexiones
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Verificar si el origen de la solicitud coincide con el permitido
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            // Mostrar un mensaje de error más descriptivo
            const errorMessage = `
                CORS Error: La solicitud fue bloqueada porque el origen de la solicitud:
                ${origin} no coincide con la URL permitida configurada en FRONTEND_URL:
                ${process.env.FRONTEND_URL}.
                
                Asegúrate de que el frontend esté enviando solicitudes desde la URL correcta.
                Si estás trabajando en desarrollo, revisa si tu entorno local tiene configurada correctamente la URL del frontend.
                
                Este error ocurrió cuando la API intentó procesar una solicitud de un origen no permitido.
            `;
            callback(new Error(errorMessage));
        }
    },
    optionsSuccessStatus: 200
};


server.use(cors(corsOptions))

// Leer datos de formulario
server.use(express.json())

// Mapeo de peticiones
server.use(morgan('short'))

server.use('/api/products', router)

server.use('/docs', swaggeUi.serve, swaggeUi.setup(swaggerSpec))

export default server