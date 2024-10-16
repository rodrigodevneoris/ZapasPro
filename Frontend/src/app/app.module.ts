import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de que esto esté bien

// Habilitar modo de producción si es necesario
enableProdMode();

// Inicia la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    { provide: AppRoutingModule, useClass: AppRoutingModule }
  ]
});
