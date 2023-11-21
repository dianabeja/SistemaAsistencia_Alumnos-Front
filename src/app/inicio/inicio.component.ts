import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { InicioService } from '../services/inicio.service';
import * as QRCode from 'qrcode';
import { NavDisplayService } from '../services/nav-display.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  estudianteData: any;
  qrCodeUrl!: string;
  fechaActual!: string;

  constructor(
    private authService: AuthService,
    private estudianteService: InicioService,
    private navDisplayService: NavDisplayService
  ) {
    const hoy = new Date();
    /* toLocaleDateString se usa para formatear 
    la fecha en un formato más legible y localizado*/
    this.fechaActual = hoy.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  ngOnInit(): void {
    this.navDisplayService.setShowNav(true);
    const token = this.authService.getToken();
    console.log(token);
    if (token) {
      this.estudianteService.getEstudiante(token).subscribe(
        (data) => {
          this.estudianteData = data.data;
          // Guardar la matrícula en el localStorage
          localStorage.setItem('matricula', this.estudianteData.matricula);
          if (this.estudianteData) {
            QRCode.toDataURL(this.estudianteData.matricula)
              .then((url: string) => {
                this.qrCodeUrl = url;
              })
              .catch((err: string) => {
                console.error('Error al generar código QR:', err);
              });
          }
        },
        (error) => {
          console.error('Error al obtener información del estudiante:', error);
        }
      );
    }
  }
}
