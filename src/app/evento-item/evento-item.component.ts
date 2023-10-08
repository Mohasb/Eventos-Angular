import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEvento } from '../interfaces/ievento';
import Swal from 'sweetalert2';
import { EventosServiceService } from '../services/eventos-service.service';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'evento-item',
  templateUrl: './evento-item.component.html',
  styleUrls: ['./evento-item.component.scss'],
})
export class EventoItemComponent {

  //Recibe un evento de su padre: eventos-show
  @Input() evento!: IEvento;
  //Cuando se pulsa borrar envía un evento para ser borrado en el padre: eventos-show
  @Output() eventoEliminar = new EventEmitter<IEvento>();


  constructor(
    private eventoService: EventosServiceService,
    private swal: SwalAlertService,
    private router: Router
  ) {}

  editaEvento() {
    this.router.navigate([`/eventos/edit/${this.evento.id}`]);
    
  }

  deleteEvento() {
    //Confirm mediante el modulo sweetalert2; Es un confirm modificado
    //Pide confirmación para borrar evento...
    Swal.fire({
      title: '¿Eliminar este Evento?',
      text: 'Esta acción no podrá ser revertida',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
    }).then((result) => {
      //...Si se confirma...
      if (result.isConfirmed) {
        //Se llama al servicio para que borre el evento
        this.eventoService.deleteEvento(this.evento).subscribe({
          next: (respuesta) => {
            if (!!respuesta) {
              //Si hay respuesta muestro alert informando
              this.swal.successAlert('Evento Borrado correctamente');
              //Emito este evento al padre(show-evento) para que lo elimine
              this.eventoEliminar.emit(this.evento);
            }
          },
          error: (error) => {
            //Si hay error muestro por consola los detalles y al usuario un alert informando
            console.error(`Error borrando
      evento!. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
            this.swal.errorAlert(
              `Se ha producido un error al borrar el evento.(Codigo error: ${error.status})`
            );
          },
          //Al acabar muestra este texto
          complete: () => console.log('borrado completo'),
        });
      }
    });
  }
}
