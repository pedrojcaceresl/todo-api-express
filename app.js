import express from "express";
import todos from "./src/db/todos.js"

const app = express();
const PORT = 3000;

app.use(express.json()) //middleware Eso le dice a Express: “cuando venga un body en formato JSON, parsealo y guardalo en req.body”.

app.get("/", (req, res) => {
    res.send("<h2>Servidor corriendo en el puerto 3000 🥰<h2/>")
})


app.get("/api/todos", (req, res) => {
    res.json({
        ok: true,
        data: todos
    })
})

app.get("/api/todos/:id", (req, res) => {
    const id = req.params.id; //recibimos el id por parametros
    let todoList = {};//declaramos una variable vacia
    todoList = todos.find((value) => value.id == id) //buscamos en el array de objetos el id que recibimos por parametros
    if (!todoList) {//si no existe el id
        return res.send("no existe") // dice que si no le ponemos el return el código sigue ejecutándose
    } else {//si existe el id
        res.json({
            ok: true,
            message: "encontrado",
            data: todoList //el objeto que coincide con el id
        });
    }
})

//post: para crear
app.post("/api/todos", (req, res) => {
    const body = req.body; // guardar en la variable body todo el contenido del cuerpo (body) de la petición HTTP que llega al servidor.
    const nuevaTarea = {
        id: todos.length + 1,
        titulo: body.titulo,
        descripcion: body.descripcion,
        fechaVencimiento: body.fechaVencimiento,
        prioridad: body.prioridad
    }
    todos.push(nuevaTarea); //esto es para guardar la nueva tarea
    res.json({
        ok: true,
        message: "Tarea agregada",
        data: nuevaTarea
    });

})


app.put("/api/todos/:id", (req, res) => {
    const id = req.params.id; //obtenemmos el id del parametro
    const tareaNueva = req.body;//los campos que mande el usuario
    //buscamos la tarea
    const tarea = todos.find((value) => value.id == id);

    if (!tarea) {
        return res.send("no existe el id");
    } else {
        Object.keys(tareaNueva).forEach((key) => {
            tarea[key] = tareaNueva[key];
        });
        res.json(tarea);//imprimimos la tarea editada ya 
    }

})

app.delete("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);//obtenemos valor del parametro y parseamos a entero
    let tareaEliminada = {}; //declaramos variable vacia
    const tareaIndice = todos.findIndex((value) => value.id === id);//enoctramos indice de la tarea
    if (tareaIndice === -1) {
       return res.send("No existe la tarea con id: " + id )//le ponemos return para que no siga ejecutandose el codigo
    } else {
        tareaEliminada = todos.splice(tareaIndice, 1);//eliminamos la tarea ( indice, cantidad de elementos a eliminar desde ese indice)
    }
    res.json({
        ok: true,
        message: "Tarea eliminada",
        data: tareaEliminada
    })
})


app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))