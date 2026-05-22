-- CreateTable
CREATE TABLE "Autor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AutorToLivro" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AutorToLivro_A_fkey" FOREIGN KEY ("A") REFERENCES "Autor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AutorToLivro_B_fkey" FOREIGN KEY ("B") REFERENCES "Livro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AutorToLivro_AB_unique" ON "_AutorToLivro"("A", "B");

-- CreateIndex
CREATE INDEX "_AutorToLivro_B_index" ON "_AutorToLivro"("B");
