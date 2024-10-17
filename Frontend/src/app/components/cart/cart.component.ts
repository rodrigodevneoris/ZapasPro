import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'; // Ajusta la ruta según tu estructura
import { ProductInterface } from '../../interfaces/product.interfaces'; // Ajusta la ruta según tu estructura


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: ProductInterface[] = []; // Aquí se almacenan los productos en el carrito
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems(); // Obtener los productos del carrito
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);;

  }

  removeFromCart(item: ProductInterface) {
    this.cartService.removeFromCart(item); // Lógica para eliminar un producto del carrito
    this.loadCart(); // Recargar el carrito después de eliminar un producto
  }

  checkout() {
    // Lógica para proceder a la compra
    alert('Procediendo a la compra...');
  }
}
