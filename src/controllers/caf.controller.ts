import { Request, Response } from 'express';
import * as cafService from '../services/caf.service';
import * as tipoService from '../services/tipoDTE.service';

export async function getCAF(req: Request, res: Response) {
  try {
    const { rut } = req.params;
    const cafs = await cafService.listCAF(rut);
    res.json(cafs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function postCAF(req: Request, res: Response) {
  try {
    const { rut } = req.params;
    const { tipoId, rangoInicio, rangoTermino } = req.body;

    if ([tipoId, rangoInicio, rangoTermino].some((v) => v === undefined)) {
      return res.status(400).json({
        error: 'tipoId, rangoInicio y rangoTermino son requeridos en el cuerpo',
      });
    }

    // validar que sean numéricos
    const tipoIdNum = Number(tipoId);
    const rangoInicioNum = Number(rangoInicio);
    const rangoTerminoNum = Number(rangoTermino);

    if ([tipoIdNum, rangoInicioNum, rangoTerminoNum].some((n) => Number.isNaN(n))) {
      return res.status(400).json({ error: 'tipoId, rangoInicio y rangoTermino deben ser numéricos' });
    }

    // Verificar que el TipoDTE exista
    const tipo = await tipoService.getById(tipoIdNum);
    if (!tipo) {
      return res.status(406).json({ error: `El TipoDTE con id ${tipoId} no existe` });
    }

    // Verificar que no exista un CAF con rango solapado para la misma empresa
    const overlap = await cafService.findOverlap(rut, rangoInicioNum, rangoTerminoNum);
    if (overlap) {
      return res.status(409).json({ error: 'Ya existe un CAF cuyo rango se solapa con el solicitado' });
    }

    const caf = await cafService.createCAF({
      rutEmisor: rut,
      tipoId: tipoIdNum,
      rangoInicio: rangoInicioNum,
      rangoTermino: rangoTerminoNum,
    });

    res.status(201).json(caf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 