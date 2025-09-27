
import pgPromise from 'pg-promise';// importa la libreria de pg-promise que nos ayuda a conectarnos a la bd por medio de promesas (async, await)
const pgp = pgPromise(); //inicializa la libreria
const db = pgp('postgres://postgres:admin@localhost:5432/todo')

export default db;