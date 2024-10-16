import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component'; // Asegúrate de importar tu componente de bienvenida
import { LoginComponent } from './components/login/login.component'; // Asegúrate de importar tu componente de login

export const routes: Routes = [
  { path: '', component: WelcomeComponent }, // Ruta para la página de bienvenida
  { path: 'login', component: LoginComponent } // Ruta para el formulario de login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
