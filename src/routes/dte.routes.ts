import { Router } from 'express';
import { postDTE, getDTE } from '../controllers/dte.controller';

const router = Router();

router
  .route('/empresa/:rut/dte')
  .post(postDTE)
  .get(getDTE);

export default router; 