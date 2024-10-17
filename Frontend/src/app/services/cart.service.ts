import { Injectable } from '@angular/core';
import { ProductInterface } from '../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: ProductInterface[] = [];

  constructor() {}

  getCartItems(): ProductInterface[] {
    return this.cartItems;
  }

  addToCart(product: ProductInterface): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.cantidad = (existingProduct.cantidad || 1) + 1; // Incrementar cantidad si ya está en el carrito
    } else {
      this.cartItems.push({ ...product, cantidad: 1 }); // Agregar nuevo producto
    }
  }

  removeFromCart(product: ProductInterface): void {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
