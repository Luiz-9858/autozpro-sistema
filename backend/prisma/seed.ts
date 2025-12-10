import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

// ← ADICIONE ESTAS LINHAS:
console.log("🔍 Arquivo seed.ts carregado!");
console.log("🔍 PrismaClient criado!");

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // ========================================
  // 1. CRIAR USUÁRIO ADMIN
  // ========================================

  const adminPassword = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@autozpro.com" },
    update: {},
    create: {
      email: "admin@autozpro.com",
      name: "Administrador",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin criado:", admin.email);

  // ========================================
  // 2. CRIAR CATEGORIAS
  // ========================================

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "freios" },
      update: {},
      create: {
        name: "Sistema de Freios",
        slug: "freios",
        description: "Pastilhas, discos, lonas e componentes de freio",
        imageUrl: "https://via.placeholder.com/300x200?text=Freios",
      },
    }),
    prisma.category.upsert({
      where: { slug: "suspensao" },
      update: {},
      create: {
        name: "Suspensão",
        slug: "suspensao",
        description: "Amortecedores, molas, braços e buchas",
        imageUrl: "https://via.placeholder.com/300x200?text=Suspensao",
      },
    }),
    prisma.category.upsert({
      where: { slug: "motor" },
      update: {},
      create: {
        name: "Motor",
        slug: "motor",
        description: "Filtros, velas, correias e peças de motor",
        imageUrl: "https://via.placeholder.com/300x200?text=Motor",
      },
    }),
    prisma.category.upsert({
      where: { slug: "eletrica" },
      update: {},
      create: {
        name: "Elétrica",
        slug: "eletrica",
        description: "Baterias, alternadores, cabos e componentes elétricos",
        imageUrl: "https://via.placeholder.com/300x200?text=Eletrica",
      },
    }),
    prisma.category.upsert({
      where: { slug: "escapamento" },
      update: {},
      create: {
        name: "Escapamento",
        slug: "escapamento",
        description: "Silenciosos, catalisadores e tubos de escape",
        imageUrl: "https://via.placeholder.com/300x200?text=Escapamento",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // ========================================
  // 3. CRIAR PRODUTOS
  // ========================================

  const products = await Promise.all([
    // FREIOS
    prisma.product.create({
      data: {
        name: "Pastilha de Freio Dianteira Bosch",
        slug: "pastilha-freio-dianteira-bosch",
        description:
          "Pastilha de freio cerâmica de alta performance. Compatível com diversos modelos.",
        price: 89.9,
        salePrice: 79.9,
        stock: 50,
        sku: "PAST-BOSCH-001",
        categoryId: categories[0].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Pastilha+Freio",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Disco de Freio Ventilado 280mm",
        slug: "disco-freio-ventilado-280mm",
        description:
          "Disco de freio ventilado em ferro fundido. Melhor dissipação de calor.",
        price: 149.9,
        stock: 30,
        sku: "DISC-VENT-280",
        categoryId: categories[0].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Disco+Freio",
        isActive: true,
      },
    }),

    // SUSPENSÃO
    prisma.product.create({
      data: {
        name: "Amortecedor Dianteiro Monroe",
        slug: "amortecedor-dianteiro-monroe",
        description:
          "Amortecedor original Monroe com válvula de alta pressão. Garantia de 1 ano.",
        price: 249.9,
        salePrice: 219.9,
        stock: 25,
        sku: "AMORT-MON-DIANT",
        categoryId: categories[1].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Amortecedor",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kit Buchas Suspensão Dianteira",
        slug: "kit-buchas-suspensao-dianteira",
        description:
          "Kit completo de buchas em poliuretano. Maior durabilidade e conforto.",
        price: 129.9,
        stock: 40,
        sku: "KIT-BUCH-DIANT",
        categoryId: categories[1].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Buchas",
        isActive: true,
      },
    }),

    // MOTOR
    prisma.product.create({
      data: {
        name: "Filtro de Óleo Mann W719/30",
        slug: "filtro-oleo-mann-w719-30",
        description:
          "Filtro de óleo original Mann. Alta eficiência de filtragem.",
        price: 45.9,
        stock: 100,
        sku: "FILT-OLE-MANN",
        categoryId: categories[2].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Filtro+Oleo",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Vela de Ignição NGK Iridium",
        slug: "vela-ignicao-ngk-iridium",
        description:
          "Vela de ignição com eletrodo de irídio. Maior durabilidade e desempenho.",
        price: 59.9,
        salePrice: 49.9,
        stock: 80,
        sku: "VELA-NGK-IRID",
        categoryId: categories[2].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Vela",
        isActive: true,
      },
    }),

    // ELÉTRICA
    prisma.product.create({
      data: {
        name: "Bateria Moura 60Ah",
        slug: "bateria-moura-60ah",
        description:
          "Bateria automotiva 60Ah com 18 meses de garantia. Tecnologia selada.",
        price: 389.9,
        stock: 20,
        sku: "BAT-MOURA-60",
        categoryId: categories[3].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Bateria",
        isActive: true,
      },
    }),

    // ESCAPAMENTO
    prisma.product.create({
      data: {
        name: "Silencioso Traseiro Inox",
        slug: "silencioso-traseiro-inox",
        description: "Silencioso em aço inoxidável. Resistente à corrosão.",
        price: 299.9,
        stock: 15,
        sku: "SILEN-INOX-TRAS",
        categoryId: categories[4].id,
        imageUrl: "https://via.placeholder.com/400x400?text=Silencioso",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${products.length} produtos criados`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log(`   - 1 Admin criado`);
  console.log(`   - ${categories.length} Categorias`);
  console.log(`   - ${products.length} Produtos`);
  console.log("\n🔐 Login Admin:");
  console.log(`   Email: admin@autozpro.com`);
  console.log(`   Senha: admin123`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
