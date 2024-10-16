import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import { getDb } from './db'; // Asegúrate de importar la función getDb

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(json()); // Para parsear JSON en las peticiones
app.use(bodyParser.json());

// Probar la conexión a la base de datos al inicio
(async () => {
    try {
        await getDb(); // Esto debe intentar abrir la base de datos
        console.log("Conexión a la base de datos establecida."); // Mensaje de éxito
    } catch (error: any) { // Agregar el tipo any
        console.error("Error al establecer la conexión a la base de datos:", error.message); // Mensaje de error
    }
})();
// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Obtener todos los productos
app.get('/api/products', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb(); // Usa getDb para obtener la conexión
        const products = await db.all('SELECT * FROM products');
        res.json({ products }); // Encapsular los productos en un objeto llamado "products"
    } catch (error) {
        next(error);
    }
});

// Obtener un producto por ID
app.get('/api/products/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const db = await getDb(); // Usa getDb para obtener la conexión
        const product = await db.get('SELECT * FROM products WHERE id = ?', id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        next(error);
    }
});

// Crear un nuevo producto reutilizando ID eliminado
app.post('/api/products', async (req: Request, res: Response, next: NextFunction) => {
    const { nombre, stock, precio, imagen } = req.body;

    try {
        const db = await getDb(); // Usa getDb para obtener la conexión
        
        // Buscar el ID más bajo que no esté en uso
        const missingIdRow = await db.get('SELECT MIN(t1.id + 1) AS nextId FROM products t1 LEFT JOIN products t2 ON t1.id + 1 = t2.id WHERE t2.id IS NULL');
        const nextId = missingIdRow?.nextId || 1; // Si no hay resultado, usamos 1 o el autoincrement

        // Insertar el nuevo producto utilizando el nextId
        await db.run('INSERT INTO products (id, nombre, stock, precio, imagen) VALUES (?, ?, ?, ?, ?)', [nextId, nombre, stock, precio, imagen]);
        
        res.status(201).json({ id: nextId, nombre, stock, precio, imagen });
    } catch (error) {
        next(error);
    }
});

// Actualizar un producto
app.put('/api/products/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { nombre, stock, precio, imagen } = req.body;

    try {
        const db = await getDb(); // Obtener la conexión a la base de datos

        // Verificar si el producto con el ID existe
        const product = await db.get('SELECT * FROM products WHERE id = ?', id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return; // Importante: asegúrate de detener la ejecución aquí si no se encuentra el producto
        }

        // Actualizar el producto con los campos que se pasan en el cuerpo de la solicitud
        await db.run(
            'UPDATE products SET nombre = ?, stock = ?, precio = ?, imagen = ? WHERE id = ?',
            [
                nombre || product.nombre,
                stock !== undefined ? stock : product.stock,
                precio !== undefined ? precio : product.precio,
                imagen || product.imagen,
                id
            ]
        );

        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
});

// Eliminar un producto
app.delete('/api/products/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const db = await getDb(); // Usa getDb para obtener la conexión
        await db.run('DELETE FROM products WHERE id = ?', id);
        console.log(`Producto con ID ${id} eliminado.`); // Mensaje en consola
        res.json({ message: `Producto con ID ${id} eliminado.` }); // Mensaje en la respuesta
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!'); // Puedes personalizar la respuesta de error
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}/api/products`);
});
