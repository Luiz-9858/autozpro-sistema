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
