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
            // Insertar la tarea en la base de datos y devolver el registro insertado
            (`INSERT INTO public.tareas(titulo, descripcion, fechavencimiento, prioridad) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
                [titulo, descripcion, fechavencimiento, prioridad]);
        //201 created
        res.status(201).json({
            ok: true,
            message: "Tarea creada con exito",
            data: nuevaTarea
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear la tarea"
        })
    }
})

app.put("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);//obtenemos el valor del id del parametro
    const { titulo, descripcion, fechavencimiento, prioridad } = req.body;//desestructuracion para obtener el dato que envia el cliente
    // Validación básica del id - > Number.isNaN() significa "is Not a Number" es decir, verifica si el valor no es un número
    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            message: "ID inválido"
        })
    }

    try {
        const tareaActualizada = await db.oneOrNone(`UPDATE tareas
	SET titulo=$1, descripcion=$2, fechavencimiento=$3, prioridad=$4
	WHERE id= $5 RETURNING *`, [titulo, descripcion, fechavencimiento, prioridad, id])
        console.log(tareaActualizada);
        if (!tareaActualizada) {
            return res.status(404).json({ //siempre en un if colocar return para que no siga ejecutandose el codigo
                ok: false,
                message: `Error no existe la tarea con id: ${id}`
            })
        }
        res.status(200).json({// Responder con 200 OK (la actualización se realizó)
            ok: true,
            message: `Tarea con id: ${id} editada con exito`,
            data: tareaActualizada
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: `Error al editar la tarea con id ${id}`
        });
    }
})


app.delete("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);//obtenemos valor de la url, y parseamos a entero
    //validacion de si el id es un numero
    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            message: "Id invalido"
        })
    }

    try {
        const tareaEliminada = await db.oneOrNone(`DELETE FROM tareas
	WHERE id= $1 RETURNING *`, [id]);
        if (!tareaEliminada) {//trae none si no existe el id
            return res.status(404).json({
                ok: false,
                message: `Error no existe la tarea con id: ${id}`
            })
        }
        res.status(200).json({
            ok: true,
            message: `Tarea con id: ${id} eliminada con exito`
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: `Error al intentar eliminar la tarea con id: ${id}`
        })
    }

})



/*app.delete("/api/todos/:id", (req, res) => {
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
})*/


app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))