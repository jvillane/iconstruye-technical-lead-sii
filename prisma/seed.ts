import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tipos = [
    { id: 33, descripcion: 'Factura Electrónica' },
    { id: 34, descripcion: 'Factura No Afecta o Exenta Electrónica' },
    { id: 56, descripcion: 'Nota de Débito Electrónica' },
    { id: 61, descripcion: 'Nota de Crédito Electrónica' },
  ];

  for (const tipo of tipos) {
    await prisma.tipoDTE.upsert({
      where: { id: tipo.id },
      update: {},
      create: tipo,
    });
  }
}

main()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('✅ Seed data inserted');
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 