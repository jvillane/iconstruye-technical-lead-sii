import { Router } from 'express';
import { getTipos } from '../controllers/tipoDTE.controller';

const router = Router();

router.get('/tipo-dte', getTipos);

export default router; 