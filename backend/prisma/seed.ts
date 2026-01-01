import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar categorias
  const categoryMotor = await prisma.category.create({
    data: {
      name: "Motor",
      slug: "motor",
      description: "Peças para motor",
    },
  });

  const categoryFreios = await prisma.category.create({
    data: {
      name: "Freios",
      slug: "freios",
      description: "Sistema de frenagem",
    },
  });

  const categoryEletrica = await prisma.category.create({
    data: {
      name: "Elétrica",
      slug: "eletrica",
      description: "Componentes elétricos",
    },
  });

  console.log("✅ Categorias criadas");

  // Criar produtos
  await prisma.product.createMany({
    data: [
      {
        name: "Bateria Moura 60Ah",
        slug: "bateria-moura-60ah",
        description: "Bateria automotiva 60Ah",
        price: 389.9,
        stock: 20,
        sku: "BAT-MOURA-60",
        categoryId: categoryEletrica.id,
      },
      {
        name: "Filtro de Óleo Mann W719-30",
        slug: "filtro-oleo-mann-w719-30",
        description: "Filtro de óleo original",
        price: 45.9,
        stock: 100,
        sku: "FILT-OLE-MANN",
        categoryId: categoryMotor.id,
      },
      {
        name: "Disco de Freio Ventilado 280mm",
        slug: "disco-freio-ventilado-280mm",
        description: "Disco de freio ventilado",
        price: 149.9,
        stock: 30,
        sku: "DISC-VENT-280",
        categoryId: categoryFreios.id,
      },
      {
        name: "Pastilha de Freio Dianteira",
        slug: "pastilha-freio-dianteira",
        description: "Pastilha de freio cerâmica",
        price: 89.9,
        salePrice: 79.9,
        stock: 50,
        sku: "PAST-BOSCH-CERAM",
        categoryId: categoryFreios.id,
      },
      {
        name: "Vela de Ignição NGK Iridium",
        slug: "vela-ignicao-ngk-iridium",
        description: "Vela de ignição com eletrodo de irídio",
        price: 59.9,
        salePrice: 49.9,
        stock: 80,
        sku: "VELA-NGK-IRID",
        categoryId: categoryEletrica.id,
      },
    ],
  });

  console.log("✅ Produtos criados");

  // Criar usuário de teste
  const hashedPassword = await hashPassword("123456");

  await prisma.user.create({
    data: {
      name: "João Silva",
      email: "joao.silva@teste.com",
      password: hashedPassword,
      role: "customer",
    },
  });

  console.log("✅ Usuário de teste criado");
  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
