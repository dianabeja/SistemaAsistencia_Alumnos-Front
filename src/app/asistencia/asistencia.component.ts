import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavDisplayService } from '../services/nav-display.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css'],
})
export class AsistenciaComponent implements OnInit {
  // Se declaran variables para guerdar los datos seleccionados
  nrc: number | null = null;
  nombreMateria: string | null = null;
  horasSemana: number | null = null;
  matricula: string | null = null;
  fechasAsistencia: any[] = []; // Almacenar las fechas de asistencia
  fechasInasistencia: any[] = []; // Almacenar las fechas de inasistencia
  fechasTotales: any[] = []; // Almacena todas las fechas combinadas
  constructor(
    private navDisplayService: NavDisplayService,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    // indicamos la visibilidad del nav-bar.component
    this.navDisplayService.setShowNav(true);
    // Recuperamos los parametros nrc y nombre
    this.route.queryParams.subscribe((params) => {
      this.nrc = params['nrc'];
      this.nombreMateria = params['nombre'];
      this.horasSemana = params['horasemana'];
    });

    // Obtener la matrícula del localStorage
    this.matricula = localStorage.getItem('matricula');
    // Obtener las fechas de asistencia
    if (this.nrc && this.matricula) {
      this.firebaseService.getAsistencia(this.nrc, this.matricula).subscribe(
        (fechas) => {
          this.fechasAsistencia = fechas;
        },
        (error) => {
          console.error('Error al obtener fechas de asistencia:', error);
        }
      );
    }

    // Obtener las fechas de inasistencia
    if (this.nrc && this.matricula) {
      this.firebaseService.getInasistencias(this.nrc, this.matricula).subscribe(
        (fechas) => {
          this.fechasInasistencia = fechas;
        },
        (error) => {
          console.error('Error al obtener fechas de inasistencia:', error);
        }
      );
    }
  }
}
