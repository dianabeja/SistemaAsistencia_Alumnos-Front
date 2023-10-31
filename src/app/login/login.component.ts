import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {}

  onSubmit() {
    const email = this.email;
    this.apiService.obtenerToken(email).subscribe(
      (response: any) => {
        const token = response.token;
        console.log('Token recibido:', token);
      
        this.authService.setToken(token);

        const credentials = [this.email, this.password];

        this.apiService.iniciarSesion(credentials).subscribe(
          (response: any) => {
            this.router.navigate(['/inicio']);
          },
          (error: any) => {
            console.log('credenciales',credentials);
            console.error('Error de inicio de sesión:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al obtener el token:', error);
      }
    );
  }
}
