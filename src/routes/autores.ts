import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { nome } = req.body;

    const autor = await prisma.autor.create({
        data: { nome }
    });

    res.status(201).json(autor);
});

router.get("/", async (req: Request, res: Response) => {
    const autores = await prisma.autor.findMany({
        include: {
            livros: true
        }
    });

    res.json(autores);
});

export default router;