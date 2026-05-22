import sqlite3 from "sqlite3";

sqlite3.verbose();

export const db = new sqlite3.Database(
    "./database.sqlite",
    (erro) => {
        if(erro) {
            console.error(
                "Erro ao conectar no banco", erro.message
            );
        } else {
            console.log("SQLite conectado com sucesso.");
        }
    }
);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS generos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    `);
});