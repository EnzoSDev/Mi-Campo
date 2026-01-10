import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Import Middlewares and Routes
import { authMiddleware } from './Middlewares/authMiddleware.js'

dotenv.config()

// Import routes

const app = express()
const PORT = process.env.SERVER_PORT

// Middlewares
app.use(cors())
app.use(express.json())
app.disable('x-powered-by')
app.use(cookieParser()) // Permite leer y crear cookies
app.use(authMiddleware)

/*
    // Configuración de __dirname en ES Modules
    import { fileURLToPath } from 'url'
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    EL NAVEGADOR NO ENTIENDE .tsx, ESTE CODIGO NO FUNCIONA PARA DESARROLLO
    DEBO LEVANTAR EL SERVIDOR DE VITE Y EL SERVIDOR DE EXPRESS POR SEPARADO

    EN PRODUCCION, DEBO COMPILAR EL FRONTEND Y SERVIR LOS ARCHIVOS ESTATICOS
    DESDE EXPRESS, PARA ESO SIRVO LA CARPETA DIST O BUILD

    VER CUANDO LLEGUE A LA PARTE DE DESPLIEGUE

    // Servir archivos estáticos del frontend
    app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')))

    // Ruta principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'Frontend', 'dist', 'index.html'))
    })
*/

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`)
})
