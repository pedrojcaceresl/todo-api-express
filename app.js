import express from "express";
import todos from "./src/db/todos.js"
import db from "./src/db/db.js"
import todoRoutes from "./src/routes/todoRoutes.js"
import sequelize from "./src/config/database.js";
import Todo from "./src/models/Todo.js";

const app = express();
const PORT = 3000;

app.use(express.json()) //middleware Eso le dice a Express: “cuando venga un body en formato JSON, parsealo y guardalo en req.body”.

//funcion
app.use("/api/todos", todoRoutes);


try {
    await sequelize.authenticate();
    console.log("conectado a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada");

    app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))
} catch (error) {
    console.log("Error no se pudo conectar a la base de datos", error);
}