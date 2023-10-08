import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IEvento } from '../interfaces/ievento';
import { EventosServiceService } from '../services/eventos-service.service';

@Component({
  //nombre para usar este componente
  selector: 'eventos-show',
  //vista de este componente
  templateUrl: './eventos-show.component.html',
  //estilos de este componente
  styleUrls: ['./eventos-show.component.scss'],
})
//Añadido implements OnInit(con su import) y el constructor y el método OnIt(al final)
export class EventosShowComponent implements OnInit {
  /////////////////////////////////////////////////VARIABLES/////////////////////////////////////////////////////////////
  //Array de eventos en formato definido en la interfaz IEvento
  eventos: IEvento[] = [];
  //Variable del input search
  filterSearch = '';
  //Varible que controla se ha completado la petición de eventos
  loadedEvents:boolean = false;


  constructor(
    private eventoService: EventosServiceService,
  ) {}

  //Cuando el componente este listo se asigna el array de eventos proporcionado por el servicio
  ngOnInit(): void {
    this.cargaEventos();
  }

  /////////////////////////////////////////////////FUNCIONES/////////////////////////////////////////////////////////////

  /*funcion que se encarga de recibir los eventos y -> 
  next: asigna el array de eventos obtenido a la variable vacía de esta clase
  error: muestra error por consola y un alert informando al usuario
  complete: muestra mensaje por consola y informa al usuario con un mensaje*/
  cargaEventos() {
    this.eventoService.getEventos().subscribe({
      next: (evts) => {
        this.loadedEvents=true;
        this.eventos = evts;
        if (evts.length) {
          console.info('Eventos cargados Correctamente');
        }
      },
      error: (error) => {
        console.error(`Error obteniendo
        eventos. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
        Swal.fire({
          title: 'Se ha producido un error al recuperar los eventos',
          text: `(Codigo error: ${error.status})`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Volver a intentar',
        }).then((result) => {
          if (result.isConfirmed) {
            //Reintenta conectar con el servidor
            this.cargaEventos();
          }
        });
      },
    });
  }

  //Funcion que se encarga de esperar a que el hijo evento-item le emita que se ha de borrar el evento pasado como parámetro y mostrar los eventos sin el eliminado
  eliminaEvento(eventoAEliminar: IEvento) {
    this.eventos = this.eventos.filter((evento) => evento !== eventoAEliminar);
  }

  //Esta función recibe un array de eventos de tipo IEvento y lo ordena de fecha menor a mayor
  ordenaPorFecha(eventos: IEvento[]) {
    eventos.sort((a, b) => {
      let da = new Date(a.date),
        db = new Date(b.date);
      return da.valueOf() - db.valueOf();
    });
  }
  //Esta función recibe un array de eventos de tipo IEvento y lo ordena por precio menor a mayor
  ordenaPorPrecio(eventos: IEvento[]) {
    eventos.sort((a, b) => {
      return a.price - b.price;
    });
  }
}
