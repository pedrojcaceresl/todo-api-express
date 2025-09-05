import express from "express";

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
    res.send("<h2>Servidor corriendo en el puerto 3000 🥰<h2/>")
})





app.listen(PORT, () => console.log("Ejecutandose en el puerto " + PORT))