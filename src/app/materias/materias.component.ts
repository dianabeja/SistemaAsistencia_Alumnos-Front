import { Component, OnInit } from '@angular/core';
import { MateriasService } from '../services/materias.service';
import { AuthService } from '../services/auth.service';
import { NavDisplayService } from '../services/nav-display.service';
import { Router } from '@angular/router';

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
    private navDisplayService: NavDisplayService,
    private router: Router
  ) {}

  // Método para manejar el clic en una materia
  verAsistencia(nrc: number, nombreMateria: string, horasSemana: number): void {
    this.router.navigate(['/asistencia'], {
      queryParams: { nrc, nombre: nombreMateria, horasemana: horasSemana },
    });
  }

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
