// db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export const getDb = async (): Promise<Database> => {
    if (!dbInstance) {
        try {
            console.log("Intentando abrir la base de datos..."); // Mensaje de depuración
            dbInstance = await open({
                filename: './database.db',
                driver: sqlite3.Database
            });

            console.log("Base de datos abierta o creada exitosamente."); // Mensaje de depuración

            // Crear la tabla de productos si no existe
            await dbInstance.exec(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    stock INTEGER NOT NULL,
                    precio REAL NOT NULL,
                    imagen TEXT NOT NULL
                )
            `);
            console.log("Tabla 'products' creada o ya existe."); // Mensaje de depuración
        } catch (error: any) { // Agregar el tipo any
            console.error("Error al abrir la base de datos:", error.message); // Mensaje de error
            throw error; // Propagar el error para manejarlo en el lugar de la llamada
        }
    }
    
    return dbInstance; // Retornar la instancia de la base de datos
};
