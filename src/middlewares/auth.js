import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export const verifyToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHead = req.headers['authorization'];
    if (!authHead) {
        return res.status(401).json({
            ok: false,
            message: "No existe token"
        })
    }
    // El token viene en el formato "Bearer <token>" y necesitamos extraer solo el token
    const token = authHead.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "No token provided"
        })
    }


    try {
        // Convierte la parte codificada en un objeto JavaScript legible,
        //  que contiene los datos que pusiste al generar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "Invalid token"
        })
    }
    next();
};

export default verifyToken;