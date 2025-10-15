import dotenv from "dotenv";
dotenv.config(); // carga variables de .env

import User from "../models/User.js"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("Este es: " + JWT_SECRET);

//Funcion registrar

export const registerUser = async (req, res) => {
    const { nombre, apellido, email, contraseña } = req.body;

    try {
        //validar los campos, si al menos uno esta vacio entra en el if
        if (!nombre || !apellido || !email || !contraseña) {
            return res.status(400).json({
                ok: false,
                message: "Todos los campos son obligatorios"
            })
        }

        // validacion para verificar si ya existe el email
        const userExist = await User.findOne({ where: { email } })
        if (userExist) {
            return res.status(400).json({
                ok: false,
                message: "Email ya registrado"
            })
        }

        const newUser = await User.create({
            nombre,
            apellido,
            email,
            contraseña

        });

        res.status(200).json({
            ok: true,
            message: "Usuario registrado con exito",
            data: { id: newUser.id, nombre: newUser.nombre, apellido: newUser.apellido, email: newUser.email }
        })

    } catch (error) {
        console.error("El error es: " + error)
        res.status(500).json({
            ok: false,
            message: "Error al registrar el usuario"
        })

    }

}

//funcion login

export const userLogin = async (req, res) => {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
        return res.status(400).json({
            ok: false,
            message: "Error campos vacios"
        })
    }
    try {

        const user = await User.findOne({ where: {email} });
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "Error el usuario con ese email no esta registrado"
            })
        }
        if (contraseña !== user.contraseña) {
            return res.status(400).json({
                ok: false,
                message: "Error contraseña o usuario incorrectos"
            })
        }

        //verificamos si existe la clave para firmar
        if (!JWT_SECRET) {
            return res.status(500).json({
                ok: false,
                message: "Error de configuracion del servidor"
            })
        }
        //creacion de token para el usuario -> jwt.sign(payload, secretOrPrivateKey, [options])
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET,  { expiresIn: "1h" });
        res.status(200).json({
            ok: true,
            message: "Usuario logueado con exito",
            data: token
        })
        

    } catch (error) {
        console.error("El error es : " + error);
        res.status(500).json({
            ok: false,
            message: "Error en el servidor 500"
        })
    }
} 