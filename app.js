import express from "express";
import todos from "./src/db/todos.js"
import db from "./src/db/db.js"

const app = express();
const PORT = 3000;


app.use(express.json()) //middleware Eso le dice a Express: “cuando venga un body en formato JSON, parsealo y guardalo en req.body”.

app.get("/", (req, res) => {
    res.send("<h2>Servidor corriendo en el puerto 3000 🥰<h2/>")
})

//funcion listar tareas con base de datos
app.get("/api/todos", async (req, res) => {

    try {//any puede ser 0 o muchos
        const tareas = await db.any("SELECT * FROM tareas");
        res.json({
            ok: true,
            data: tareas
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            ok: false,
            message: "Error al obtener las tareas"
        });
    }

})

//funcion de listar por id
app.get("/api/todos/:id", async (req, res) => {
    const id = req.params.id; //recibimos el id por parametros
    try {
        const tareas = await db.oneOrNone(" SELECT * FROM tareas WHERE id=$1", [id]);//consultamos a la bd la tarea que coincida con el id que recibimos por parametros
        if (!tareas) {//si no existe la tarea
            return res.status(404).json({ //le ponemos return para que no siga ejecutandose el codigo
                ok: false,
                message: `Tarea con ese id: ${id} no encontrada`
            });
        }
        res.json({
            ok: true,
            message: "Tarea encontrada",
            data: tareas //el objeto que coincide con el id
        });
    } catch (err) {
        console.error(err);//imprimimos el error en la consola
        res.status(500).json({
            ok: false,
            message: "Error al obtener la tarea"
        });
    }

})



//post para crear
app.post("/api/todos", async (req, res) => {
    const { titulo, descripcion, fechavencimiento, prioridad } = req.body;//aplicamos lo que seria la desestructuracion para obtener los campos del body y guardarlos en variables
    try {
        const nuevaTarea = await db.one
            (`INSERT INTO public.tareas(titulo, descripcion, fechavencimiento, prioridad) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
                [titulo, descripcion, fechavencimiento, prioridad]);

        res.status(202).json({
            ok: true,
            message: "Tarea creada con exito",
            data: nuevaTarea
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear la tarea"
        })
    }
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
        return res.send("No existe la tarea con id: " + id)//le ponemos return para que no siga ejecutandose el codigo
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