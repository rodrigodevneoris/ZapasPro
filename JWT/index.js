const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const cors = require('cors');
const db = require('./database'); // Importa la base de datos

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

// Endpoint de registro
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Verifica que el rol sea válido
    if (role !== 'client' && role !== 'admin') {
        return res.status(400).json({ message: 'Rol inválido. Usa "client" o "admin".' });
    }

    // Verifica si el usuario ya existe
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la base de datos.' });
        }
        if (row) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Encripta la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserta el nuevo usuario en la base de datos
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al registrar el usuario.' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        });
    });
});

// Endpoint de inicio de sesión
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la base de datos.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Verifica la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const accessToken = generateAccessToken({ username: user.username, role: user.role });
        res.header('Authorization', accessToken).json({
            message: 'Usuario autenticado',
            token: accessToken,
            role: user.role
        });
    });
});

// Middleware para validar el token
function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'] || req.query.accessToken;
    if (!accessToken) return res.sendStatus(401); // Access denied

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Access denied, token expired or incorrect
        } else {
            req.user = user;
            next();
        }
    });
}

// Función para generar el token de acceso
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '30m' });
};

// Endpoint para acceder a datos según el rol
app.get('/api', validateToken, (req, res) => {
    if (req.user.role === 'admin') {
        res.json({
            message: 'Bienvenido al panel de administración',
            username: req.user.username
        });
    } else {
        res.json({
            message: 'Bienvenido al área de clientes',
            username: req.user.username
        });
    }
});

// Endpoint para ver todos los usuarios registrados
app.get('/users', (req, res) => {
    db.all('SELECT username, role FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la base de datos.' });
        }
        res.json(rows);
    });
});

app.listen(3100, () => {
    console.log('Servidor iniciado...');
});
