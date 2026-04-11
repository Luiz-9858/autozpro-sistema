import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🚗 CONTROLLER DE VEÍCULOS
 *
 * Endpoints para seletor cascata:
 * 1. Anos disponíveis
 * 2. Marcas por ano
 * 3. Modelos por marca e ano
 * 4. Versões por marca, modelo e ano
 */

/**
 * GET /api/vehicles/years
 * Retorna todos os anos disponíveis (ordem decrescente)
 */
export const getYears = async (req: Request, res: Response) => {
  try {
    // Buscar anos únicos de todos os veículos
    const vehicles = await prisma.vehicle.findMany({
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "desc", // Mais recente primeiro
      },
    });

    const years = vehicles.map((v) => v.year);

    res.json({
      success: true,
      data: years,
      count: years.length,
    });
  } catch (error) {
    console.error("Erro ao buscar anos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar anos disponíveis",
    });
  }
};

/**
 * GET /api/vehicles/brands?year=2024
 * Retorna marcas que têm veículos em determinado ano
 */
export const getBrands = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : undefined;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Parâmetro 'year' é obrigatório",
      });
    }

    // Buscar marcas únicas para o ano especificado
    const vehicles = await prisma.vehicle.findMany({
      where: {
        year: year,
      },
      select: {
        brand: true,
      },
      distinct: ["brand"],
      orderBy: {
        brand: "asc", // Ordem alfabética
      },
    });

    const brands = vehicles.map((v) => v.brand);

    res.json({
      success: true,
      data: brands,
      count: brands.length,
      filters: {
        year,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar marcas",
    });
  }
};

/**
 * GET /api/vehicles/models?brand=Chevrolet&year=2024
 * Retorna modelos de uma marca em determinado ano
 */
export const getModels = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : undefined;
    const brand = req.query.brand as string;

    if (!year || !brand) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros 'year' e 'brand' são obrigatórios",
      });
    }

    // Buscar modelos únicos para marca e ano
    const vehicles = await prisma.vehicle.findMany({
      where: {
        year: year,
        brand: brand,
      },
      select: {
        model: true,
      },
      distinct: ["model"],
      orderBy: {
        model: "asc", // Ordem alfabética
      },
    });

    const models = vehicles.map((v) => v.model);

    res.json({
      success: true,
      data: models,
      count: models.length,
      filters: {
        year,
        brand,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar modelos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar modelos",
    });
  }
};

/**
 * GET /api/vehicles/versions?brand=Chevrolet&model=Onix&year=2024
 * Retorna versões/motorizações de um modelo específico
 */
export const getVersions = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : undefined;
    const brand = req.query.brand as string;
    const model = req.query.model as string;

    if (!year || !brand || !model) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros 'year', 'brand' e 'model' são obrigatórios",
      });
    }

    // Buscar todas versões/motores para o veículo específico
    const vehicles = await prisma.vehicle.findMany({
      where: {
        year: year,
        brand: brand,
        model: model,
      },
      select: {
        id: true,
        version: true,
        engine: true,
        fuelType: true,
      },
      orderBy: [{ version: "asc" }, { engine: "asc" }],
    });

    // Formatar resposta com informações combinadas
    const versions = vehicles.map((v) => ({
      id: v.id,
      version: v.version,
      engine: v.engine,
      fuelType: v.fuelType,
      // Label formatado: "LT 1.0 Turbo Flex"
      label: [v.version, v.engine, v.fuelType].filter(Boolean).join(" "),
    }));

    res.json({
      success: true,
      data: versions,
      count: versions.length,
      filters: {
        year,
        brand,
        model,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar versões:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar versões",
    });
  }
};

/**
 * GET /api/vehicles/search?brand=Chevrolet&model=Onix&year=2024&version=LT
 * Busca veículo específico completo (útil para validação)
 */
export const searchVehicle = async (req: Request, res: Response) => {
  try {
    const { brand, model, year, version } = req.query;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        brand: brand as string,
        model: model as string,
        year: year ? parseInt(year as string) : undefined,
        version: (version as string) || undefined,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Veículo não encontrado",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar veículo",
    });
  }
};

/**
 * GET /api/vehicles/stats
 * Estatísticas gerais (útil para debug/admin)
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const [total, brands, models, yearRange] = await Promise.all([
      // Total de veículos
      prisma.vehicle.count(),

      // Total de marcas únicas
      prisma.vehicle.findMany({
        select: { brand: true },
        distinct: ["brand"],
      }),

      // Total de modelos únicos
      prisma.vehicle.findMany({
        select: { model: true },
        distinct: ["model"],
      }),

      // Range de anos
      prisma.vehicle.aggregate({
        _min: { year: true },
        _max: { year: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalVehicles: total,
        totalBrands: brands.length,
        totalModels: models.length,
        yearRange: {
          min: yearRange._min.year,
          max: yearRange._max.year,
        },
        brands: brands.map((b) => b.brand).sort(),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar estatísticas",
    });
  }
};
