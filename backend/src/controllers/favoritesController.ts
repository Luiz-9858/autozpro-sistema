import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user?.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('❌ [getFavorites] Erro:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro ao carregar favoritos' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    // Verificar se já existe
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: req.user?.id || '',
          productId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Produto já está nos favoritos',
      });
    }

    // Criar favorito
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user?.id || '',
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    console.error('❌ [addFavorite] Erro:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro ao adicionar aos favoritos' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const favorite = await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: req.user?.id || '',
          productId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Removido dos favoritos',
      data: favorite,
    });
  } catch (error) {
    console.error('❌ [removeFavorite] Erro:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro ao remover dos favoritos' });
  }
};

export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Se não tem user, retorna false
    if (!req.user?.id) {
      return res.json({ success: true, isFavorited: false });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    const isFavorited = !!favorite;
    res.json({ success: true, isFavorited });
  } catch (error) {
    console.error('❌ [checkFavorite] Erro:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro ao verificar favorito' });
  }
};
