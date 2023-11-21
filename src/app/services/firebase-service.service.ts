import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File): Observable<string> {
    // Genera un nombre único para el archivo
    const filePath = `profile_images/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Crea un observable para obtener la URL de descarga cuando la carga esté completa
    return new Observable((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (url) => {
                console.log(url);
                observer.next(url);
                observer.complete();
              },
              (error) => {
                observer.error(error);
                observer.complete();
              }
            );
          })
        )
        .subscribe();
    });
  }
}
