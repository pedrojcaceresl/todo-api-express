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


try {
    await sequelize.authenticate();
    console.log("conectado a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada");

    app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))
} catch (error) {
    console.log("Error no se pudo conectar a la base de datos", error);
}