// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea o abre la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crear tabla de usuarios si no existe
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )`);
    }
});

module.exports = db;
