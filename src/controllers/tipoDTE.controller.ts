import { Request, Response } from 'express';
import * as tipoService from '../services/tipoDTE.service';

export async function getTipos(req: Request, res: Response) {
  try {
    const tipos = await tipoService.listTipos();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 