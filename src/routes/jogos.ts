import { Request, Response, Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const jogos = await prisma.jogo.findMany();
        res.json(jogos);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar jogos" });
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
        const jogo = await prisma.jogo.findUnique({
            where: {id},
            include: {
                genero: true,
                plataformas: true
            }
        });

        if (!jogo) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }

        res.json(jogo);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar jogo" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { titulo, generoId, plataformasId } = req.body;

    if(!titulo || !generoId) {
        return res.status(400).json({
            erro: "Titulo e generoId são obrigatorios"
        });
    }

    try {
        const genero = await prisma.genero.findUnique({
            where: {
                id: Number(generoId)
            }
        });

        if(!genero) {
            return res.status(404).json({
                erro: "Genero não encontrado"
            });
        }

        if (plataformasId && Array.isArray(plataformasId)) {
            const plataformas = await prisma.plataforma.findMany({
                where: {
                    id: {
                        in: plataformasId
                    }
                }
            });

            if(plataformas.length !== plataformasId.length) {
                return res.status(400).json({
                    erro: "Uma ou mais plataformas não cadastradas"
                });
            }
        }

        const jogo = await prisma.jogo.create({
            data: {
                titulo: titulo,
                generoId: Number(generoId),
                plataformas: {
                    connect: (plataformasId && Array.isArray(plataformasId)) ? plataformasId.map((id: number) => ({id})) : []
                }
            },
            include: {
                genero: true,
                plataformas: true
            }
        });

        res.status(201).json(jogo);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar jogo" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if(Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Id invalido"
        });
    }

    try {
        const jogo = await prisma.jogo.findUnique({
            where: {id}
        });

        if (!jogo) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }

        await prisma.jogo.delete({
            where: {id}
        });

        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao excluir jogo" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {titulo, generoId} = req.body;

    if(Number.isNaN(id)) {
        return res.status(400).json({
            erro: "Id invalido"
        });
    }

    if(!titulo || titulo.trim() === "") {
        return res.status(400).json({
            erro: "Campo titulo é obrigatorio"
        });
    }

    if(!generoId) {
        return res.status(400).json({
            erro: "Campos genero ou plataformas invalidos"
        });
    }

    try {
        const jogoExistente = await prisma.jogo.findUnique({ where: { id } });
        if (!jogoExistente) {
             return res.status(404).json({ erro: "Jogo não encontrado" });
        }

        const jogoAtualizado = await prisma.jogo.update({
            where: {id},
            data: {
                titulo: titulo.trim(),
                generoId: Number(generoId)
            },
            include: {
                genero: true
            }
        });

        res.json(jogoAtualizado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar jogo" });
    }
});

router.post("/:id/plataformas", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {plataformasId} = req.body;

    if (!plataformasId || !Array.isArray(plataformasId)) {
        return res.status(400).json({ erro: "Lista de IDs de plataformas é obrigatória" });
    }

    try {
        const jogo = await prisma.jogo.findUnique({
            where: {id}
        });

        if(!jogo) {
            return res.status(404).json({
                erro: "Jogo não encontrado"
            });
        }

        const plataformas = await prisma.plataforma.findMany({
            where: {
                id: {
                    in: plataformasId
                }
            }
        });

        if(plataformas.length !== plataformasId.length) {
            return res.status(400).json({
                erro: "Uma ou mais plataformas não foram encontradas"
            });
        }

        const jogoAtualizado = await prisma.jogo.update({
            where: {id},
            data: {
                plataformas: {
                    set: plataformasId.map((idPlataforma: number) => ({id: idPlataforma}))
                }
            },
            include: {
                genero: true,
                plataformas: true
            }
        });

        res.json(jogoAtualizado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar plataformas do jogo" });
    }
});

export default router;