import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_URL: string = 'http://localhost:3000/api/products';

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<any> {
    return this.httpClient.get(this.API_URL);
  }

  updateProduct(updatedProduct: ProductInterface): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/${updatedProduct.id}`, updatedProduct);
  }
}
