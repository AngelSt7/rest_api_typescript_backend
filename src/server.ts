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

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
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