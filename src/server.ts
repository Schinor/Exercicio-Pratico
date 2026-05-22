import express from "express";
import "./db"
import generosRouter from "./routes/generos";
import livrosRouter from "./routes/livros";
import autoresRouter from "./routes/autores";

const app = express();
const PORT = 3000;

app.use(express.json());
    
app.use("/generos", generosRouter);
app.use("/livros", livrosRouter);
app.use("/autores", autoresRouter);

app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`)
});