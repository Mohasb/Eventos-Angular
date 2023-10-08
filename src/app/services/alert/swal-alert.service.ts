import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
//Servicio que usa swal para mostrar alerts modificados
export class SwalAlertService {

  constructor() {}

  //Alert de succes
  successAlert(mensaje: string) {
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //Aler de error
  errorAlert(error:string) {
    Swal.fire({
      title: '¡Error!',
      text: error,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
