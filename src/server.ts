import express from "express";
import generoRouter from "./routes/generos";
import plataformaRouter from "./routes/plataformas";
import jogoRouter from "./routes/jogos";

const app = express();
const PORT = 3300;

app.use(express.json());

app.use("/jogos", jogoRouter);
app.use("/generos", generoRouter);
app.use("/plataformas", plataformaRouter);

app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`)
});