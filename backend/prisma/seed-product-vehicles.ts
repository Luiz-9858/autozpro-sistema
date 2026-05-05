import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔧 SEED: ASSOCIAR PRODUTOS A VEÍCULOS (TESTE RÁPIDO)
 *
 * Associa alguns produtos a veículos populares para testar filtro.
 * Execute apenas UMA VEZ para teste.
 */

async function seedProductVehicles() {
  console.log("🔧 Iniciando associação produtos ↔ veículos...\n");

  try {
    // 1️⃣ BUSCAR ALGUNS PRODUTOS
    const products = await prisma.product.findMany({
      take: 20, // Primeiros 20 produtos
      select: { id: true, name: true },
    });

    if (products.length === 0) {
      console.log("❌ Nenhum produto encontrado no banco!");
      console.log("   Execute o seed de produtos primeiro.\n");
      return;
    }

    console.log(`✅ Encontrados ${products.length} produtos\n`);

    // 2️⃣ BUSCAR VEÍCULOS POPULARES
    const popularVehicles = await prisma.vehicle.findMany({
      where: {
        OR: [
          { brand: "Chevrolet", model: "Onix", year: 2024 },
          { brand: "Chevrolet", model: "S10", year: 2024 },
          { brand: "Fiat", model: "Argo", year: 2024 },
          { brand: "Fiat", model: "Toro", year: 2024 },
          { brand: "Volkswagen", model: "Gol", year: 2023 },
          { brand: "Volkswagen", model: "T-Cross", year: 2024 },
          { brand: "Toyota", model: "Hilux", year: 2024 },
          { brand: "Ford", model: "Ranger", year: 2024 },
        ],
      },
      select: { id: true, brand: true, model: true, year: true },
    });

    if (popularVehicles.length === 0) {
      console.log("❌ Nenhum veículo popular encontrado!");
      console.log("   Execute o seed de veículos primeiro.\n");
      return;
    }

    console.log(`✅ Encontrados ${popularVehicles.length} veículos populares:`);
    popularVehicles.forEach((v) => {
      console.log(`   - ${v.brand} ${v.model} ${v.year}`);
    });
    console.log();

    // 3️⃣ ESTRATÉGIA DE ASSOCIAÇÃO
    let associationsCreated = 0;

    for (const product of products) {
      // Cada produto compatível com 2-4 veículos aleatórios
      const randomCount = Math.floor(Math.random() * 3) + 2; // 2 a 4
      const shuffled = [...popularVehicles].sort(() => Math.random() - 0.5);
      const selectedVehicles = shuffled.slice(0, randomCount);

      for (const vehicle of selectedVehicles) {
        try {
          await prisma.productVehicle.create({
            data: {
              productId: product.id,
              vehicleId: vehicle.id,
            },
          });
          associationsCreated++;
        } catch (error: any) {
          // Ignorar duplicatas (se já existe)
          if (error.code !== "P2002") {
            console.error(`Erro ao associar ${product.name}:`, error.message);
          }
        }
      }

      console.log(
        `✅ ${product.name.substring(0, 40)}... → ${randomCount} veículos`,
      );
    }

    console.log(`\n🎉 Associação concluída!`);
    console.log(`📊 Total de associações criadas: ${associationsCreated}`);
    console.log();
    console.log("🧪 COMO TESTAR:");
    console.log("   1. Vá para http://localhost:5173");
    console.log("   2. Selecione: Ano 2024 → Marca Chevrolet → Modelo Onix");
    console.log('   3. Click "IR" → Vai para /products');
    console.log(
      "   4. Deve mostrar apenas produtos compatíveis com Onix 2024!",
    );
    console.log('   5. Badge verde "✓ Compatível" aparece nos cards');
    console.log();
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProductVehicles();
