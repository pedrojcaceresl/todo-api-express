
import db from "../db/db.js"
import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
    try {//any puede ser 0 o muchos
        const tareas = await Todo.findAll();
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
}

export const getTodosById = async (req, res) => {
    const id = req.params.id; //recibimos el id por parametros
    try {
        const tareas = await Todo.findByPk(id);
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
}

export const createTodos = async (req, res) =>{
const { titulo, descripcion, fecha_vencimiento, prioridad, esta_hecho } = req.body;//aplicamos lo que seria la desestructuracion para obtener los campos del body y guardarlos en variables
    try {
        const nuevaTarea = await Todo.create({ titulo, descripcion, fecha_vencimiento, prioridad, esta_hecho  });
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
}