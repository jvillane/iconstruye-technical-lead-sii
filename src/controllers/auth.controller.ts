import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'admin') {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
} 