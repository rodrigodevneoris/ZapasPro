import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component'; // Asegúrate de importar tu componente de bienvenida
import { LoginComponent } from './components/login/login.component'; // Asegúrate de importar tu componente de login
import { ProductComponent } from './components/product/product.component';
import { StoreComponent } from './components/store/store.component';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './services/cart.service'; // Importar el servicio
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  { path: '', component: WelcomeComponent }, // Ruta para la página de bienvenida
  { path: 'admin', component: ProductComponent },
  { path: 'login', component: LoginComponent }, // Ruta para el formulario de login
  { path: 'store', component: StoreComponent }, // Ruta para el componente de la tienda
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' } // Ruta comodín para redirigir a la página de inicio
];

@NgModule({
  declarations: [CartComponent,],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule, CartComponent],
  providers: [CartService]
})
export class AppRoutingModule { }
