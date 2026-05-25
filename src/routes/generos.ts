import { Request, Response, Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const plataformas = await prisma.plataforma.findMany({
            include: {
                jogos: true
            }
        });

        res.json(plataformas);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar plataformas" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if(Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Id invalido"
        });
    }

    try {
        const plataforma = await prisma.plataforma.findUnique({
            where: {id},
            include: {
                jogos: true
            }
        });

        if(!plataforma) {
            return res.status(404).json({
                erro: "plataforma não encontrada"
            });
        }

        res.json(plataforma);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar plataforma" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const {nome} = req.body;

    if(!nome || nome.trim() === "") {
        return res.status(400).json({
            erro: "Campo nome é obrigatorio"
        });
    }

    try {
        const plataforma = await prisma.plataforma.create({
            data: {
                nome: nome
            }
        });

        res.status(201).json(plataforma);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar plataforma" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    if(Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Campo id é obrigatorio"
        });
    }

    try {
        const plataforma = await prisma.plataforma.findUnique({
            where: {id}
        });

        if(!plataforma) {
            return res.status(404).json({
                erro: "plataforma não encontrada"
            });
        }

        await prisma.plataforma.delete({
            where: {id}
        });

        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao excluir plataforma" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {nome} = req.body;

    if(Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Campo id é obrigatorio"
        });
    }

    try {
        const plataformaExistente = await prisma.plataforma.findUnique({
            where: {id}
        });

        if(!plataformaExistente) {
            return res.status(404).json({
                erro: "Plataforma não encontrada"
            });
        }

        const plataformaAtualizada = await prisma.plataforma.update({
            where: {id},
            data: {
                nome: nome
            }
        });

        return res.json(plataformaAtualizada)
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar plataforma" });
    }
});

export default router;