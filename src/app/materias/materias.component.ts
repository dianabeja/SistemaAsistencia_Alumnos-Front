import { Component, OnInit } from '@angular/core';
import { MateriasService } from '../services/materias.service';
import { AuthService } from '../services/auth.service';
import { NavDisplayService } from '../services/nav-display.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export class MateriasComponent implements OnInit {
  materias: any[] = [];

  constructor(
    private materiasService: MateriasService,
    private authService: AuthService,
    private navDisplayService: NavDisplayService
  ) {}

  ngOnInit(): void {
    this.navDisplayService.setShowNav(true);
    const token = this.authService.getToken();
    if (token) {
      this.materiasService.obtenerNrcs(token).subscribe({
        next: (nrcs) => {
          this.materiasService.generarTokenNrcs(nrcs.nrcs).subscribe({
            next: (tokenRes) => {
              localStorage.setItem('materiasToken', tokenRes.token);
              this.materiasService.obtenerMaterias(tokenRes.token).subscribe({
                next: (materiasRes) => {
                  this.materias = materiasRes;
                },
                error: (err) =>
                  console.error('Error al obtener materias:', err),
              });
            },
            error: (err) => console.error('Error al generar token:', err),
          });
        },
        error: (err) => console.error('Error al obtener NRCs:', err),
      });
    }
  }
}
