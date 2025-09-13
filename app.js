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

app.get("/api/todos/:id",(req, res) => {
    const id = req.params.id; //recibimos el id por parametros
   // const body = req.body
   let todoList  = {};//declaramos una variable vacia
   todoList = todos.find((value) => value.id == id ) //buscamos en el array de objetos el id que recibimos por parametros
   if(!todoList){//si no existe el id
    res.send("no existe")
   }else{//si existe el id
    res.json({
        ok: true,
        message: "encontrado",
        data: todoList //el objeto que coincide con el id
    });
   }
})


app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))