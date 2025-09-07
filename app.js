import express from "express";
import todos from "./src/db/todos.js"

const app = express();
const PORT = 3000;

app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h2>Servidor corriendo en el puerto 3000 🥰<h2/>")
})


app.get("/api/todos", (req, res) => {
    res.json({
        ok: true,
        data: todos
    })
} )


app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))