export interface ProductInterface {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad?: number;
  stock: number; // Agrega esta propiedad si es necesaria
}
