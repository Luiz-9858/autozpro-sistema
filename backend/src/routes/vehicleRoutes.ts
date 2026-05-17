import { Router } from "express";
import {
  getYears,
  getBrands,
  getModels,
  getVersions,
  searchVehicle,
  getStats,
} from "../controllers/vehicleController";

const router = Router();

/**
 * 🚗 ROTAS DE VEÍCULOS
 *
 * Públicas (não requerem autenticação):
 * - Seletor cascata para escolher veículo na home
 * - Busca de produtos compatíveis
 */

// ========== SELETOR CASCATA ==========

/**
 * GET /api/vehicles/years
 * Retorna anos disponíveis (2027, 2026, 2025...)
 */
router.get("/years", getYears);

/**
 * GET /api/vehicles/brands?year=2024
 * Retorna marcas que têm veículos em 2024
 */
router.get("/brands", getBrands);

/**
 * GET /api/vehicles/models?brand=Chevrolet&year=2024
 * Retorna modelos da Chevrolet em 2024
 */
router.get("/models", getModels);

/**
 * GET /api/vehicles/versions?brand=Chevrolet&model=Onix&year=2024
 * Retorna versões do Onix 2024 (LT, LTZ, Premier, etc)
 */
router.get("/versions", getVersions);

/**
 * GET /api/vehicles/admin-search?q=termo
 * Busca livre por texto (para admin associar produtos)
 */
router.get("/admin-search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Digite no mínimo 3 caracteres",
      });
    }

    const searchTerm = q.toLowerCase();
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const vehicles = await prisma.vehicle.findMany({
      where: {
        OR: [
          { brand: { contains: searchTerm, mode: "insensitive" } },
          { model: { contains: searchTerm, mode: "insensitive" } },
          { version: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: [{ brand: "asc" }, { model: "asc" }, { year: "desc" }],
      take: 50,
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar veículos",
    });
  }
});

// ========== BUSCA E STATS ==========

/**
 * GET /api/vehicles/search?brand=Chevrolet&model=Onix&year=2024&version=LT
 * Busca veículo específico completo
 */
router.get("/search", searchVehicle);

/**
 * GET /api/vehicles/stats
 * Estatísticas gerais (debug/admin)
 */
router.get("/stats", getStats);

export default router;
