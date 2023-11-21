import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  constructor(private http: HttpClient) {}

  private apiURL = 'http://localhost:3000/api/v1/estudiantes/';

  //Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  obtenerNrcs(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<any>(`${this.apiURL}materiasAlumno`, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  generarTokenNrcs(nrcs: number[]): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}generarToken`, nrcs)
      .pipe(retry(1), catchError(this.handleError));
  }

  obtenerMaterias(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<any>(`${this.apiURL}materias`, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error code: ${error.status} \n Message: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
