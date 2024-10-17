import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interfaces';
import { CommonModule } from '@angular/common'; // Importa CommonModule aquí

@Component({
  selector: 'app-store',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule], // Asegúrate de importar CommonModule aquí
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']  // Asegúrate de que esta línea esté presente
})
export class StoreComponent implements OnInit {

  products: ProductInterface[] = [];
  cartCount = 0; // Contador de productos en el carrito
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (result: any) => {
        this.products = result.products;
      },
      error: (err: any) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }

  addToCart(product: ProductInterface): void {
    // Aquí puedes agregar la lógica para agregar el producto al carrito.
    console.log('Producto agregado al carrito:', product);
  }
}
