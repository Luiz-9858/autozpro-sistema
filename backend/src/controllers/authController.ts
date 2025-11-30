import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

/**
 * Registrar novo usuário
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, name, password } = req.body;

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email já cadastrado",
      });
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "customer",
      },
    });

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Retornar usuário (sem a senha!)
    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
}

/**
 * Login de usuário
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    // Verificar senha
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
}

/**
 * Obter dados do usuário logado
 */
export async function getMe(req: Request, res: Response) {
  try {
    // O middleware já validou o token e colocou o userId no req
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
}
