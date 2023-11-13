import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/estudiantes';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    console.log('se guardo el token');
  }

  login(credentials: any): Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});

    return this.http.post(`${this.apiUrl}/IniciarSesion`, credentials, { headers });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }
}
