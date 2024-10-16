import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProdcutInterface } from '../../interfaces/product.interfaces';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  producList: ProdcutInterface[]=[]
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProdcuts()
  }

  getProdcuts(){
    this.productService.getProducts().subscribe({
      next: (result) => {
        this.producList = result.products;
      },
      error: (err)=> {
        console.log(err);
      }
    })
  }

}
