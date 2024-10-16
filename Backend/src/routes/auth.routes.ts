import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User'; // Asegúrate de que la ruta al modelo de usuario es correcta

const router = express.Router();
const JWT_SECRET = 'tu_clave_secreta'; // Cambia esto por una clave secreta más segura

// Registro de usuarios
router.post('/register', [
  body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // Asegúrate de salir de la función después de enviar una respuesta
  }

  const { username, password } = req.body;

  // Verifica si el usuario ya existe
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    res.status(400).json({ message: 'El usuario ya existe' });
    return; // Asegúrate de salir de la función después de enviar una respuesta
  }

  // Crea un nuevo usuario
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Inicio de sesión
router.post('/login', [
  body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
], async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // Asegúrate de salir de la función después de enviar una respuesta
  }

  const { username, password } = req.body;

  // Verifica las credenciales del usuario
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return; // Asegúrate de salir de la función después de enviar una respuesta
  }

  // Genera el token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
