import prisma from '../utils/prisma';

export async function listTipos() {
  return prisma.tipoDTE.findMany();
}

export async function getById(id: number) {
  return prisma.tipoDTE.findUnique({ where: { id } });
} 