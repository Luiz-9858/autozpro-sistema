import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

// ========================================
// 📝 REGISTER - Criar novo usuário
// ========================================

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email já cadastrado",
      });
      return;
    }

    // 2️⃣ Hash da senha
    const hashedPassword = await hashPassword(password);

    // 3️⃣ Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer", // Por padrão, novo usuário é customer
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 4️⃣ Gerar token JWT
    const token = generateToken({ userId: user.id });

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao registrar usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar usuário",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 🔐 LOGIN - Autenticar usuário
// ========================================

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email ou senha inválidos",
      });
      return;
    }

    // 2️⃣ Verificar senha
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Email ou senha inválidos",
      });
      return;
    }

    // 3️⃣ Gerar token JWT
    const token = generateToken({ userId: user.id });

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao fazer login",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 👤 ME - Obter dados do usuário autenticado
// ========================================

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user é definido pelo authMiddleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
      return;
    }

    // Buscar dados completos do usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar dados do usuário",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
