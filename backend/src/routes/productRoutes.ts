import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";
import { PrismaClient } from "@prisma/client"; // 🚗 NOVO

const router = Router();
const prisma = new PrismaClient(); // 🚗 NOVO

// ========================================
// 🔓 ROTAS PÚBLICAS (sem autenticação)
// ========================================

// GET /api/products - Listar todos os produtos (COM PAGINAÇÃO)
router.get("/", getProducts);

// GET /api/products/:id - Buscar produto por ID
router.get("/:id", getProductById);

// ========================================
// 🔐 ROTAS PROTEGIDAS (admin apenas)
// ========================================

// POST /api/products - Criar novo produto (admin)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// PUT /api/products/:id - Atualizar produto (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// DELETE /api/products/:id - Deletar produto (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

// ========================================
// 🚗 ROTAS DE VEÍCULOS (admin apenas)
// ========================================

/**
 * POST /api/products/:id/vehicles
 * Associar veículo a produto
 */
router.post(
  "/:id/vehicles",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { vehicleId } = req.body;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          message: "vehicleId é obrigatório",
        });
      }

      const association = await prisma.productVehicle.create({
        data: {
          productId: id,
          vehicleId: vehicleId,
        },
      });

      res.json({
        success: true,
        data: association,
        message: "Veículo associado com sucesso",
      });
    } catch (error: any) {
      // Erro de duplicata (já existe)
      if (error.code === "P2002") {
        return res.status(400).json({
          success: false,
          message: "Veículo já está associado a este produto",
        });
      }

      console.error("❌ Erro ao associar veículo:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao associar veículo",
      });
    }
  },
);

/**
 * DELETE /api/products/:id/vehicles/:vehicleId
 * Desassociar veículo de produto
 */
router.delete(
  "/:id/vehicles/:vehicleId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id, vehicleId } = req.params;

      await prisma.productVehicle.delete({
        where: {
          productId_vehicleId: {
            productId: id,
            vehicleId: vehicleId,
          },
        },
      });

      res.json({
        success: true,
        message: "Veículo desassociado com sucesso",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Associação não encontrada",
        });
      }

      console.error("❌ Erro ao desassociar veículo:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao desassociar veículo",
      });
    }
  },
);

/**
 * GET /api/products/:id/vehicles
 * Listar veículos associados a um produto
 */
router.get("/:id/vehicles", async (req, res) => {
  try {
    const { id } = req.params;

    const vehicles = await prisma.productVehicle.findMany({
      where: { productId: id },
      include: { vehicle: true },
    });

    res.json({
      success: true,
      data: vehicles.map((pv) => pv.vehicle),
      count: vehicles.length,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar veículos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar veículos",
    });
  }
});

export default router;
