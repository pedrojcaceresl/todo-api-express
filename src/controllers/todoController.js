
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

export const updateTodos = async (req, res) =>{
    const id = parseInt(req.params.id);//obtenemos el valor del id del parametro
    const { titulo, descripcion, fecha_vencimiento, prioridad, esta_hecho } = req.body;//desestructuracion para obtener el dato que envia el cliente
    // Validación básica del id - > Number.isNaN() significa "is Not a Number" es decir, verifica si el valor no es un número
    if (Number.isNaN(id)) {
        return res.status(400).json({
            ok: false,
            message: "ID inválido"
        })
    }

    try {
        const tareaUpdate = await Todo.findByPk(id);//obtenemos el id 
        if (!tareaUpdate) {
            return res.status(404).json({ //siempre en un if colocar return para que no siga ejecutandose el codigo
                ok: false,
                message: `Error no existe la tarea con id: ${id}`
            })
        }
        const tareaAntigua = { ...tareaUpdate.dataValues } //hacemos una copia del objeto original antes de actualizarlo
        //actualizamos los campos, hacemos la validacion de que si es undefined no lo actualice
        if (titulo !== undefined) tareaUpdate.titulo = titulo;
        if (descripcion !== undefined) tareaUpdate.descripcion = descripcion;
        if(fecha_vencimiento !== undefined) tareaUpdate.fecha_vencimiento = fecha_vencimiento;
        if (prioridad !== undefined) tareaUpdate.prioridad = prioridad;
        if (esta_hecho !== undefined) tareaUpdate.esta_hecho = esta_hecho;
        console.log("Tarea antigua:", tareaAntigua);
        console.log("Tarea actualizada:", tareaUpdate.dataValues);

        await tareaUpdate.save(); //guardamos los cambios
        res.status(200).json({// Responder con 200 OK (la actualización se realizó)
            ok: true,
            message: `Tarea con id: ${id} editada con exito`,
            data: tareaUpdate
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: `Error al editar la tarea con id ${id}`
        });
    }
}