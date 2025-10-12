import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        tableName: "users",
        timestamps: true
    }
)

export default User;