import prisma from '../utils/prisma';

export async function listCAF(rutEmisor: string) {
  return prisma.cAF.findMany({ where: { rutEmisor }, include: { tipo: true } });
}

export async function createCAF(params: {
  rutEmisor: string;
  tipoId: number;
  rangoInicio: number;
  rangoTermino: number;
}) {
  const { rutEmisor, tipoId, rangoInicio, rangoTermino } = params;
  return prisma.cAF.create({ data: { rutEmisor, tipoId, rangoInicio, rangoTermino } });
}

export async function findOverlap(rutEmisor: string, rangoInicio: number, rangoTermino: number) {
  return prisma.cAF.findFirst({
    where: {
      OR: [
        {
          rutEmisor,
          rangoInicio: { lte: rangoInicio },
          rangoTermino: { gte: rangoInicio },
        },
        {
          rutEmisor,
          rangoInicio: { lte: rangoTermino },
          rangoTermino: { gte: rangoTermino },
        },
        {
          rutEmisor,
          rangoInicio: { gte: rangoInicio },
          rangoTermino: { lte: rangoTermino },
        }
      ]
    },
  });
}

export async function getByCodigo(codigo: string) {
  return prisma.cAF.findUnique({ where: { codigo } });
} 