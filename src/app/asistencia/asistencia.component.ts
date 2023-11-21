import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavDisplayService } from '../services/nav-display.service';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

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
  listaCombinada: any[] = []; // Lista para almacenar ambas asistencias e inasistencias
  derecho: string = '';
  asistenciasTotales: number = 0;
  totalAsistencias: number = 0;
  totalClases: number = 0;

  constructor(
    private navDisplayService: NavDisplayService,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router
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
          this.combinarListas();
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
          this.combinarListas();
          this.determinarTipoExamen();
        },
        (error) => {
          console.error('Error al obtener fechas de inasistencia:', error);
        }
      );
    }
  }

  combinarListas() {
    // Combinar y mapear las listas a objetos con el formato deseado
    this.listaCombinada = [
      ...this.fechasAsistencia
        .map((fecha) => ({
          fecha: this.convertirAFecha(fecha.fecha),
          asistencia: 'Sí',
        }))
        .filter((item) => item.fecha !== null), // Filtra las fechas nulas
      ...this.fechasInasistencia
        .map((fecha) => ({
          fecha: this.convertirAFecha(fecha.fecha),
          asistencia: 'No',
        }))
        .filter((item) => item.fecha !== null),
    ];

    // Calcular el total de clases y asistencias
    this.totalClases = this.listaCombinada.length;
    this.totalAsistencias = this.listaCombinada.filter(
      (item) => item.asistencia === 'Sí'
    ).length;

    // Ordenar la lista combinada
    this.listaCombinada.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  // Método para convertir un string de fecha al formato día-mes-año a un objeto Date
  convertirAFecha(fechaStr: string): Date | null {
    if (!fechaStr) {
      return null; // Retorna null si la fecha no está definida
    }
    const partes = fechaStr.split('-').map(Number);
    return new Date(partes[2], partes[1] - 1, partes[0]);
  }

  // Método para formatear una fecha a un string más legible
  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long', // nombre del día de la semana
      year: 'numeric', // año en formato numérico
      month: 'long', // nombre del mes
      day: 'numeric', // día del mes
    });
  }

  // Metodo para calcular el tipo de examen
  determinarTipoExamen(): void {
    //  Calcular asistencias totales
    this.asistenciasTotales = (16 * (this.horasSemana || 0)) / 2;
    console.log('Asistencias Totales: ', this.asistenciasTotales);
    // Paso 2: Calcular porcentaje de inasistencias
    const inasistencias = this.fechasInasistencia.length;
    console.log('Inasistencias: ', inasistencias);
    const porcentajeInasistencias =
      (inasistencias / this.asistenciasTotales) * 100;
    console.log('Porcentaje de Inasistencias: ', porcentajeInasistencias);
    // Paso 3: Determinar tipo de examen
    if (porcentajeInasistencias <= 4) {
      this.derecho = 'Exento';
    } else if (porcentajeInasistencias <= 20) {
      this.derecho = 'Ordinario';
    } else if (porcentajeInasistencias <= 30) {
      this.derecho = 'Extraordinario';
    } else if (porcentajeInasistencias <= 40) {
      this.derecho = 'Titulación';
    } else {
      this.derecho = 'Reprobado';
    }
  }

  volverAMaterias() {
    this.router.navigate(['/materias']);
  }
}
