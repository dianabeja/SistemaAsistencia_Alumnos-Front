import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener las fechas de asistencia
  getAsistencia(nrc: number, matricula: string): Observable<any[]> {
    const asistenciaPath = `/ISW/Materias/${nrc}/${matricula}/Asistencia`;
    return this.firestore.collection(asistenciaPath).valueChanges();
  }

  // Método para obtener inasistencias
  getInasistencias(nrc: number, matricula: string): Observable<any[]> {
    const inasistenciaPath = `/ISW/Materias/${nrc}/${matricula}/Inasistencia`;
    return this.firestore.collection(inasistenciaPath).valueChanges();
  }
}
