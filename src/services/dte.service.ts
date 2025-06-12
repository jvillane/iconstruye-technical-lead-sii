import prisma from '../utils/prisma';

export interface DTEItemInput {
  numeroLinea: number;
  nombreItem: string;
  cantidad: number;
  precio: number;
  monto: number;
}

export interface CreateDTEInput {
  rutEmisor: string;
  folio: number;
  tipoId: number;
  razonSocialEmisor: string;
  rutReceptor: string;
  razonSocialReceptor: string;
  montoNeto: number;
  iva: number;
  total: number;
  items: DTEItemInput[];
}

export async function createDTE(data: CreateDTEInput) {
  const {
    rutEmisor,
    folio,
    tipoId,
    razonSocialEmisor,
    rutReceptor,
    razonSocialReceptor,
    montoNeto,
    iva,
    total,
    items,
  } = data;

  return prisma.dTE.create({
    data: {
      rutEmisor,
      folio,
      tipoId,
      razonSocialEmisor,
      rutReceptor,
      razonSocialReceptor,
      montoNeto,
      iva,
      total,
      items: {
        create: items.map((it) => ({
          numeroLinea: it.numeroLinea,
          nombreItem: it.nombreItem,
          cantidad: it.cantidad,
          precio: it.precio,
          monto: it.monto,
        })),
      }
    },
    include: {
      items: true,
    },
  });
}

export async function getByTriad(rutEmisor: string, folio: number, tipoId: number) {
  return prisma.dTE.findFirst({
    where: { rutEmisor, folio, tipoId },
    include: { items: true },
  });
}

// Asynchronous validation of totals
export async function validate(dteId: number): Promise<void> {
  const dte = await prisma.dTE.findUnique({
    where: { id: dteId },
    include: { items: true },
  });

  if (!dte) return;

  const itemsTotal = dte.items.reduce((sum: number, item: { monto: any }) => sum + Number(item.monto), 0);
  const netIvaTotal = Number(dte.montoNeto) + Number(dte.iva);
  const declaredTotal = Number(dte.total);

  const discrepancies: string[] = [];

  if (itemsTotal !== declaredTotal) {
    discrepancies.push(`Suma de ítems (${itemsTotal}) distinta al total declarado (${declaredTotal})`);
  }

  if (netIvaTotal !== declaredTotal) {
    discrepancies.push(`Monto Neto (${dte.montoNeto}) + IVA (${dte.iva}) = ${netIvaTotal} distinto al total declarado (${declaredTotal})`);
  }

  if (discrepancies.length === 0) {
    await prisma.dTE.update({
      where: { id: dteId },
      data: { estado: 'CORRECTO', glosa: 'Montos validados correctamente' },
    });
  } else {
    await prisma.dTE.update({
      where: { id: dteId },
      data: { estado: 'ERROR', glosa: discrepancies.join(' | ') },
    });
  }
}

export function scheduleValidation(dteId: number) {
  // Ejecutar en otro ciclo del event-loop
  setImmediate(() => {
    validate(dteId).catch((e) => console.error('Error en validación DTE', e));
  });
} 