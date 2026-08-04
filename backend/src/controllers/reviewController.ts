import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * ⭐ REVIEW CONTROLLER
 * Gerenciar as avaliações de produtos (correto)
 */

// ========================================
// ⭐ CRIAR AVALIAÇÃO
// ========================================
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    const { productId, rating, title, comment } = req.body;

    // Validações
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Preencha todos os campos obrigatórios",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating deve ser entre 1 e 5",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Título não pode ter mais de 100 caracteres",
      });
    }

    // Verificar se produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Verificar se usuário já avaliou este produto
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Você já avaliou este produto",
      });
    }

    // Verificar se usuário comprou o produto
    const userOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: "DELIVERED",
        items: {
          some: {
            productId,
          },
        },
      },
    });

    // Criar avaliação -
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        verified: !!userOrder, // Verificado se comprou
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(`✅ Avaliação criada: ${review.id}`);

    res.status(201).json({
      success: true,
      data: review,
      message: "Avaliação enviada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao criar avaliação:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar avaliação",
      error: error instanceof Error ? error.message : "Desconhecido",
    });
  }
};

// ========================================
// ⭐ LISTAR AVALIAÇÕES DO PRODUTO
// ========================================
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    // Verificar se produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Filtro de rating
    const where: any = { productId };
    if (rating) {
      where.rating = parseInt(rating as string);
    }

    // Contar total
    const total = await prisma.review.count({ where });

    // Buscar avaliações
    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    // Calcular média de ratings
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.length > 0
        ? (
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          ).toFixed(1)
        : 0;

    console.log(
      `📖 ${reviews.length} avaliações encontradas para produto ${productId}`,
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        averageRating: parseFloat(averageRating as string),
        totalReviews: total,
      },
      message: "Avaliações encontradas",
    });
  } catch (error) {
    console.error("❌ Erro ao buscar avaliações:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar avaliações",
      error: error instanceof Error ? error.message : "Desconhecido",
    });
  }
};

// ========================================
// ⭐ ATUALIZAR AVALIAÇÃO (PRÓPRIA)
// ========================================
export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    // Buscar avaliação
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Avaliação não encontrada",
      });
    }

    // Verificar se é o dono
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para editar esta avaliação",
      });
    }

    // Validar dados
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating deve ser entre 1 e 5",
      });
    }

    // Atualizar
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || review.rating,
        title: title || review.title,
        comment: comment || review.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(`✅ Avaliação ${reviewId} atualizada`);

    res.json({
      success: true,
      data: updatedReview,
      message: "Avaliação atualizada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar avaliação:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar avaliação",
      error: error instanceof Error ? error.message : "Desconhecido",
    });
  }
};

// ========================================
// ⭐ DELETAR AVALIAÇÃO (ADMIN OU DONO)
// ========================================
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    // Buscar avaliação
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Avaliação não encontrada",
      });
    }

    // Verificar permissões (dono ou admin)
    if (review.userId !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para deletar esta avaliação",
      });
    }

    // Deletar
    await prisma.review.delete({
      where: { id: reviewId },
    });

    console.log(`✅ Avaliação ${reviewId} deletada`);

    res.json({
      success: true,
      message: "Avaliação deletada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao deletar avaliação:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar avaliação",
      error: error instanceof Error ? error.message : "Desconhecido",
    });
  }
};

// ========================================
// ⭐ VERIFICAR SE USUÁRIO JÁ AVALIOU
// ========================================
export const checkUserReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.json({
        success: true,
        data: { hasReview: false, review: null },
      });
    }

    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        hasReview: !!review,
        review,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao verificar avaliação:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao verificar avaliação",
    });
  }
};
