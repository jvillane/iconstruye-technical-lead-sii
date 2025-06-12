import { Request, Response } from 'express';
import * as dteService from '../services/dte.service';
import * as tipoService from '../services/tipoDTE.service';
import * as cafService from '../services/caf.service';
import { scheduleValidation } from '../services/dte.service';

export async function postDTE(req: Request, res: Response) {
  try {
    const { rut } = req.params;
    const {
      folio,
      tipoId,
      codigoCaf,
      razonSocialEmisor,
      rutReceptor,
      razonSocialReceptor,
      montoNeto,
      iva,
      total,
      items,
    } = req.body;

    // Validaciones básicas presencia
    if ([folio, tipoId, codigoCaf, razonSocialEmisor, rutReceptor, razonSocialReceptor, montoNeto, iva, total, items].some((v) => v === undefined)) {
      return res.status(400).json({ error: 'Faltan campos requeridos en el cuerpo' });
    }

    // Validaciones numéricas
    const folioNum = Number(folio);
    const tipoIdNum = Number(tipoId);
    const montoNetoNum = Number(montoNeto);
    const ivaNum = Number(iva);
    const totalNum = Number(total);

    if ([folioNum, tipoIdNum, montoNetoNum, ivaNum, totalNum].some((n) => Number.isNaN(n))) {
      return res.status(400).json({ error: 'folio, tipoId, montoNeto, iva y total deben ser numéricos' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items debe ser un arreglo con al menos un elemento' });
    }

    for (const [idx, item] of items.entries()) {
      const { numeroLinea, cantidad, precio, monto } = item;
      if ([numeroLinea, cantidad, precio, monto].some((v) => v === undefined)) {
        return res.status(400).json({ error: `item ${idx} incompleto` });
      }
      const numeroLineaNum = Number(numeroLinea);
      const cantidadNum = Number(cantidad);
      const precioNum = Number(precio);
      const montoNum = Number(monto);
      if ([numeroLineaNum, cantidadNum, precioNum, montoNum].some((n) => Number.isNaN(n))) {
        return res.status(400).json({ error: `item ${idx} contiene valores no numéricos` });
      }
      // actualizar item valores numéricos para pasarlos al servicio
      item.numeroLinea = numeroLineaNum;
      item.cantidad = cantidadNum;
      item.precio = precioNum;
      item.monto = montoNum;
    }

    // Verificar que el tipo exista
    const tipo = await tipoService.getById(tipoIdNum);
    if (!tipo) {
      return res.status(406).json({ error: `El TipoDTE con id ${tipoId} no existe` });
    }

    // Verificar CAF y rango
    const caf = await cafService.getByCodigo(String(codigoCaf));
    if (!caf || caf.rutEmisor !== rut) {
      return res.status(406).json({ error: 'El código CAF no existe para la empresa indicada' });
    }

    if (folioNum < caf.rangoInicio || folioNum > caf.rangoTermino) {
      return res.status(406).json({ error: 'El folio no está dentro del rango autorizado por el CAF' });
    }

    // Crear DTE
    try {
      const dte = await dteService.createDTE({
        rutEmisor: rut,
        folio: folioNum,
        tipoId: tipoIdNum,
        razonSocialEmisor,
        rutReceptor,
        razonSocialReceptor,
        montoNeto: montoNetoNum,
        iva: ivaNum,
        total: totalNum,
        items
      });

      // Disparar la validación en segundo plano
      scheduleValidation(dte.id);

      return res.status(201).json(dte);
    } catch (error: any) {
      // Unique constraint violation on rutEmisor+folio+tipoId
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Ya existe un DTE con el mismo folio y tipo para este emisor' });
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getDTE(req: Request, res: Response) {
  try {
    const { rut } = req.params;
    const folioParam = req.query.folio;
    const tipoParam = req.query.tipoDte ?? req.query.tipoId;

    if (folioParam === undefined || tipoParam === undefined) {
      return res.status(400).json({ error: 'folio y tipoDte son requeridos como query params' });
    }

    const folio = Number(folioParam);
    const tipoId = Number(tipoParam);

    if (Number.isNaN(folio) || Number.isNaN(tipoId)) {
      return res.status(400).json({ error: 'folio y tipoDte deben ser numéricos' });
    }

    const dte = await dteService.getByTriad(rut, folio, tipoId);

    if (!dte) {
      return res.status(404).json({ error: 'DTE no encontrado' });
    }

    return res.json(dte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 