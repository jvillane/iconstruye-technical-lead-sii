import express, { Request, Response } from 'express';
import cafRouter from './routes/caf.routes';
import tipoDTERouter from './routes/tipoDTE.routes';
import dteRouter from './routes/dte.routes';
import authRouter from './routes/auth.routes';
import { expressjwt as jwt } from 'express-jwt';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

app.use(
  jwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: ['/login'],
  })
);

app.use(authRouter);

// Rutas de dominio
app.use(cafRouter);
app.use(tipoDTERouter);
app.use(dteRouter);

// Manejador de errores para JWT
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token JWT no proporcionado o inválido' });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});