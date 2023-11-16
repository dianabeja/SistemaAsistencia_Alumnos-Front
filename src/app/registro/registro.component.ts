import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../services/registro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { NavDisplayService } from '../services/nav-display.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  /* Se utiliza el operador no nulidad !  
  para decirle a TypeScript que estas 
  propiedades serán inicializadas antes de ser utilizadas*/
  registroForm!: FormGroup;
  imagePreview!: string | ArrayBuffer;
  hide = true;
  selectedFileName: string = 'Seleccionar imagen';
  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private snackBar: MatSnackBar,
    private router: Router,
    private firebaseService: FirebaseServiceService,
    private navDisplayService: NavDisplayService
  ) {}

  ngOnInit() {
    this.navDisplayService.setShowNav(false);
    this.registroForm = this.fb.group({
      matricula: ['', [Validators.required, Validators.pattern(/^S\d{8}$/)]],
      correo: [
        '',
        [Validators.required, Validators.pattern(/^.+@estudiantes.uv.mx$/)],
      ],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      url_imagen: [''], // Se actualizará con la URL de Firebase
      //imagen: [null, Validators.required], // Usado para la validación y carga de la imagen
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.firebaseService.uploadImage(file).subscribe(
        (url: string) => {
          this.registroForm.patchValue({ url_imagen: url });
          console.log(this.registroForm.value);
          this.imagePreview = url; // Para mostrar la vista previa de la imagen
        },
        (error) => {
          console.error();
        }
      );
      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        if (
          typeof reader.result === 'string' ||
          reader.result instanceof ArrayBuffer
        ) {
          this.imagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFileName = 'No se ha seleccionado ningún archivo';
    }
  }

  onRegister() {
    console.log(this.registroForm.value);
    if (
      this.registroForm.invalid ||
      !this.registroForm.get('url_imagen')?.value
    ) {
      this.snackBar.open(
        'Por favor, completa el formulario correctamente y sube una imagen.',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    this.registroService.registerUser(this.registroForm.value).subscribe({
      next: (response) => {
        // Notificar al usuario del registro exitoso
        this.snackBar.open(
          'Registro exitoso, serás redirigido al inicio de sesión.',
          'Cerrar',
          {
            duration: 3000,
          }
        );

        // Redirigir al usuario a la página de inicio de sesión después de un corto retraso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        // Notificar al usuario del error
        this.snackBar.open(
          'Error al registrar: ' + err.error.message,
          'Cerrar',
          {
            duration: 3000,
          }
        );
      },
    });
  }
}
