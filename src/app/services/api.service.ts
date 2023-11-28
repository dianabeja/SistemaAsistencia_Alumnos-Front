import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =
    'https://apialumnos-service-dianabeja.cloud.okteto.net/api/v1/estudiantes';

  constructor(private http: HttpClient) {}

  obtenerToken(correo: string): Observable<any> {
    const valor = { correo };
    return this.http.post(`${this.apiUrl}/generarToken`, valor);
  }

  iniciarSesion(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/IniciarSesion`, credentials);
  }
}
