import sequelize from "../config/database.js";
import { DataTypes, Sequelize } from "sequelize";


const Todo = sequelize.define("Todo",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_vencimiento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        prioridad: {
            type: DataTypes.STRING,
            allowNull: false
        },
        esta_hecho: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    }, {
    tableName: "todos",
    timestamps: true
}
)
export default Todo;