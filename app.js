import 'dotenv/config'
import express from "express";
import sequelize from "./src/config/database.js";

import todoRoutes from "./src/routes/todoRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import cors from 'cors'



const app = express();
const PORT = 3000;
app.use(express.json()) //middleware Eso le dice a Express: “cuando venga un body en formato JSON, parsealo y guardalo en req.body”.
app.use(cors({
    origin: '*' // permite solo tu frontend
}))

app.use("/api/todos", todoRoutes);
app.use("/api/auth", userRoutes);



try {
    await sequelize.authenticate();
    console.log("conectado a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada");

    app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))
} catch (error) {
    console.log("Error no se pudo conectar a la base de datos", error);
}