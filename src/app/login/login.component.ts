import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { corr } from 'mathjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavDisplayService } from '../services/nav-display.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  correoPlaceholder: string = 'Correo Electrónico';
  contrasenaPlaceholder: string = 'Contraseña';
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private navDisplayService: NavDisplayService
  ) {
    this.loginForm = this.fb.group({
      correo: [
        '',
        [Validators.required, Validators.pattern(/^.+@estudiantes.uv.mx$/)],
      ],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.navDisplayService.setShowNav(false);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open(
        'Por favor, completa todos los campos correctamente.',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    } else {
      const correo = this.loginForm.get('correo')?.value;
      const contraseña = this.loginForm.get('contraseña')?.value;

      const credentials = [correo, contraseña];

      this.apiService.iniciarSesion(credentials).subscribe(
        (response: any) => {
          const token = response.token;
          console.log('Token recibido:', token);

          this.authService.setToken(token);

          this.snackBar.open('Inicio de sesión exitoso.', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/inicio']);
        },
        (error: any) => {
          console.log('credenciales', credentials);
          console.error('Error de inicio de sesión:', error);
          this.snackBar.open(
            'Error de inicio de sesión: ' + error.error.message,
            'Cerrar',
            {
              duration: 3000,
            }
          );
        }
      );
    }
  }
}
