import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component'; // Asegúrate de importar tu componente de bienvenida
import { LoginComponent } from './components/login/login.component'; // Asegúrate de importar tu componente de login
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent }, // Ruta para la página de bienvenida
  { path: 'admin', component: ProductComponent },
  { path: 'login', component: LoginComponent }, // Ruta para el formulario de login
  { path: '**', redirectTo: '/', pathMatch: 'full' } // Ruta comodín para redirigir a la página de inicio
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
