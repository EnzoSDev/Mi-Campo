import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Middlewares and Routes
import { authMiddleware } from "./middlewares/authMiddleware.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import fieldsRoutes from "./routes/fields.routes.js";
import lotsRoutes from "./routes/lots.routes.js";
import campaignsRoutes from "./routes/campaigns.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.disable("x-powered-by");

/*
    Cuando llegue el momento de produccion, parece que la configuracion de CORS se debe sacar porque en las
    app moviles no existe el concepto de CORS, solo en los navegadores.


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

app.use("/user", userRoutes);

app.use(authMiddleware); // Si existe el token en las cookies, valida y agrega la info del usuario a req.user
app.use("/fields", fieldsRoutes);
app.use("/lots", lotsRoutes);
app.use("/campaigns", campaignsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
