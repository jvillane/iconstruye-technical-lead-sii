import { Router } from 'express';
import { getCAF, postCAF } from '../controllers/caf.controller';

const router = Router();

// /empresa/:rut/caf
router.route('/empresa/:rut/caf')
  .get(getCAF)
  .post(postCAF);

export default router; 