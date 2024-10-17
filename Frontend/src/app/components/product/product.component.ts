import { Component, OnInit, TrackByFunction } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  producList: ProductInterface[] = [];
  message: string | null = null; // Para mostrar mensajes de éxito
  trackByFn: TrackByFunction<ProductInterface> = this.trackById; // Asignación directa
  hoveredProductId: number | null = null; // Para manejar el estado de hover

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (result: any) => {
        this.producList = result.products;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  trackById(index: number, item: ProductInterface): number {
    return item.id; // Usar el id del producto para el seguimiento
  }

  setHovered(productId: number | null): void {
    this.hoveredProductId = productId; // Establecer el ID del producto que está siendo hover
  }

  updateProduct(product: ProductInterface): void {
    this.productService.updateProduct(product).subscribe({
      next: (result) => {
        console.log('Producto actualizado:', result);
        this.message = `Producto "${product.nombre}" actualizado con éxito!`; // Mensaje de éxito
        this.getProducts(); // Actualiza la lista después de la modificación

        // Limpia el mensaje después de 3 segundos
        setTimeout(() => {
          this.message = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar el producto:', err);
      }
    });
  }
}
