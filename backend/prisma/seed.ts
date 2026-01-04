import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // 1. Limpar dados existentes (cuidado em produção!)
  console.log("🧹 Limpando dados antigos...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar usuário de teste
  console.log("👤 Criando usuário de teste...");
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "João Silva",
      email: "joao.silva@teste.com",
      password: hashedPassword,
    },
  });
  console.log(`✅ Usuário criado: ${user.email}`);

  // 3. Criar categorias
  console.log("📂 Criando categorias...");

  const motorCat = await prisma.category.create({
    data: {
      name: "Motor",
      slug: "motor",
      description: "Peças e componentes do motor",
    },
  });

  const freiosCat = await prisma.category.create({
    data: {
      name: "Freios",
      slug: "freios",
      description: "Sistema de frenagem",
    },
  });

  const suspensaoCat = await prisma.category.create({
    data: {
      name: "Suspensão",
      slug: "suspensao",
      description: "Componentes de suspensão",
    },
  });

  const eletricaCat = await prisma.category.create({
    data: {
      name: "Elétrica",
      slug: "eletrica",
      description: "Sistema elétrico e eletrônico",
    },
  });

  const filtrosCat = await prisma.category.create({
    data: {
      name: "Filtros",
      slug: "filtros",
      description: "Filtros automotivos",
    },
  });

  const oleosCat = await prisma.category.create({
    data: {
      name: "Óleo e Fluidos",
      slug: "oleo-e-fluidos",
      description: "Óleos e fluidos diversos",
    },
  });
  console.log(`✅ 6 categorias criadas`);

  // 4. Criar produtos
  console.log("📦 Criando produtos...");
  const products = await prisma.product.createMany({
    data: [
      // MOTOR
      {
        name: "Jogo de Velas NGK",
        slug: "jogo-de-velas-ngk",
        sku: "JDV-0001",
        description: "Jogo com 4 velas de ignição NGK para motores 1.0 e 1.6",
        price: 89.9,
        stock: 50,
        categoryId: motorCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Velas+NGK",
        isActive: true,
      },
      {
        name: "Correia Dentada Gates",
        slug: "correia-dentada-gates",
        sku: "CDG-0002",
        description: "Correia dentada original Gates com 137 dentes",
        price: 145.0,
        stock: 30,
        categoryId: motorCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Correia+Gates",
        isActive: true,
      },
      {
        name: "Bomba D'água Nakata",
        slug: "bomba-dagua-nakata",
        sku: "BDN-0003",
        description: "Bomba d'água com vedação em borracha",
        price: 210.0,
        stock: 20,
        categoryId: motorCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Bomba+Agua",
        isActive: true,
      },

      // FREIOS
      {
        name: "Pastilha de Freio Bosch",
        slug: "pastilha-de-freio-bosch",
        sku: "PFB-0004",
        description: "Jogo de pastilhas de freio dianteiras Bosch - Original",
        price: 120.0,
        stock: 40,
        categoryId: freiosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Pastilha+Bosch",
        isActive: true,
      },
      {
        name: "Disco de Freio Fremax",
        slug: "disco-de-freio-fremax",
        sku: "DFF-0005",
        description: "Par de discos de freio ventilados 240mm",
        price: 280.0,
        stock: 25,
        categoryId: freiosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Disco+Fremax",
        isActive: true,
      },
      {
        name: "Fluido de Freio DOT 4",
        slug: "fluido-de-freio-dot-4",
        sku: "FFD-0006",
        description: "Fluido de freio DOT 4 Bosch 500ml",
        price: 25.9,
        stock: 60,
        categoryId: freiosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Fluido+DOT4",
        isActive: true,
      },

      // SUSPENSÃO
      {
        name: "Amortecedor Cofap",
        slug: "amortecedor-cofap",
        sku: "AMC-0007",
        description: "Amortecedor dianteiro Cofap linha turbogas",
        price: 189.0,
        stock: 35,
        categoryId: suspensaoCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/F39C12/FFFFFF?text=Amortecedor",
        isActive: true,
      },
      {
        name: "Kit de Molas Eibach",
        slug: "kit-de-molas-eibach",
        sku: "KME-0008",
        description: "Kit com 2 molas esportivas Eibach",
        price: 450.0,
        salePrice: 399.0,
        stock: 15,
        categoryId: suspensaoCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/F39C12/FFFFFF?text=Molas+Eibach",
        isActive: true,
      },

      // ELÉTRICA
      {
        name: "Bateria Moura 60Ah",
        slug: "bateria-moura-60ah",
        sku: "BM6-0009",
        description: "Bateria automotiva Moura 60 amperes - 12V",
        price: 520.0,
        stock: 18,
        categoryId: eletricaCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=Bateria+Moura",
        isActive: true,
      },
      {
        name: "Alternador Valeo",
        slug: "alternador-valeo",
        sku: "ALV-0010",
        description: "Alternador remanufaturado Valeo 90A",
        price: 380.0,
        salePrice: 340.0,
        stock: 12,
        categoryId: eletricaCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=Alternador",
        isActive: true,
      },

      // FILTROS
      {
        name: "Filtro de Ar Mann",
        slug: "filtro-de-ar-mann",
        sku: "FAM-0011",
        description: "Filtro de ar do motor Mann Filter",
        price: 45.0,
        stock: 55,
        categoryId: filtrosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/1ABC9C/FFFFFF?text=Filtro+Ar",
        isActive: true,
      },
      {
        name: "Filtro de Óleo Tecfil",
        slug: "filtro-de-oleo-tecfil",
        sku: "FOT-0012",
        description: "Filtro de óleo do motor Tecfil",
        price: 28.9,
        stock: 70,
        categoryId: filtrosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/1ABC9C/FFFFFF?text=Filtro+Oleo",
        isActive: true,
      },
      {
        name: "Filtro de Combustível Bosch",
        slug: "filtro-de-combustivel-bosch",
        sku: "FCB-0013",
        description: "Filtro de combustível externo Bosch",
        price: 38.0,
        stock: 45,
        categoryId: filtrosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/1ABC9C/FFFFFF?text=Filtro+Comb",
        isActive: true,
      },

      // ÓLEO E FLUIDOS
      {
        name: "Óleo Castrol 5W30",
        slug: "oleo-castrol-5w30",
        sku: "OC5-0014",
        description: "Óleo sintético Castrol Edge 5W30 - 1 litro",
        price: 65.0,
        stock: 80,
        categoryId: oleosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/34495E/FFFFFF?text=Oleo+Castrol",
        isActive: true,
      },
      {
        name: "Aditivo de Radiador",
        slug: "aditivo-de-radiador",
        sku: "ADR-0015",
        description: "Aditivo para radiador concentrado - 1 litro",
        price: 22.5,
        stock: 50,
        categoryId: oleosCat.id,
        imageUrl:
          "https://via.placeholder.com/300x300/34495E/FFFFFF?text=Aditivo",
        isActive: true,
      },
    ],
  });
  console.log(`✅ ${products.count} produtos criados`);

  // 5. Criar um pedido de exemplo
  console.log("🛒 Criando pedido de exemplo...");

  // Buscar alguns produtos para o pedido
  const productList = await prisma.product.findMany({ take: 3 });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      total: 324.8,
      orderItems: {
        create: [
          {
            productId: productList[0].id,
            quantity: 2,
            price: productList[0].price,
          },
          {
            productId: productList[1].id,
            quantity: 1,
            price: productList[1].price,
          },
          {
            productId: productList[2].id,
            quantity: 1,
            price: productList[2].price,
          },
        ],
      },
    },
  });
  console.log(`✅ Pedido criado: #${order.id}`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📊 RESUMO:");
  console.log(`   - 1 usuário: joao.silva@teste.com / 123456`);
  console.log(`   - 6 categorias`);
  console.log(`   - 15 produtos (com slug, sku e isActive)`);
  console.log(`   - 1 pedido de exemplo`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
