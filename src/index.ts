import express, { Request, Response } from 'express';
import cafRouter from './routes/caf.routes';
import tipoDTERouter from './routes/tipoDTE.routes';
import dteRouter from './routes/dte.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example endpoint 1: Health check
app.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

// Example endpoint 2: Echo back posted JSON payload
app.post('/echo', (req: Request, res: Response) => {
  res.json({ youSent: req.body });
});

// Rutas de dominio
app.use(cafRouter);
app.use(tipoDTERouter);
app.use(dteRouter);

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});