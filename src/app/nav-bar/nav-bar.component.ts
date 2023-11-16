import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavDisplayService } from '../services/nav-display.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  navOpen = false; // Estado para el menú desplegable
  constructor(
    private router: Router,
    public navDisplayService: NavDisplayService
  ) {}

  toggleNav() {
    this.navOpen = !this.navOpen; // Cambia el estado al hacer clic
  }

  logout() {
    localStorage.clear(); // Limpia todo el almacenamiento local
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
