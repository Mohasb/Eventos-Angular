import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { IEvento } from '../interfaces/ievento';
import { EventosServiceService } from '../services/eventos-service.service';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComponentDeactivate } from '../guards/save-changes.guard';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'evento-add',
  templateUrl: './evento-add.component.html',
  styleUrls: ['./evento-add.component.scss'],
})
export class EventoAddComponent implements ComponentDeactivate {
  eventForm!: FormGroup;
  newEvento!: IEvento;

  //Referencia hacia el input:file para poder resetarar el campo al añadir un evento
  @ViewChild('fileImage', { static: false })
  myFileInput!: ElementRef;
  showErrorImage: boolean = false;

  //Objeto tipo EventEmitir que será usado para emitir un evento de tipo IEvento al padre: eventos-show
  @Output() sendEvento = new EventEmitter<IEvento>();

  //booleano que determina si se ha añadido o no un evento para evitar el canDeactivate guard
  isAddedEvent: boolean = false;

  constructor(
    private eventoService: EventosServiceService,
    private swal: SwalAlertService,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Establece un title personalizado
    this.titleService.setTitle('Añadir evento');
    this.inicializaFormGroup();
  }

  inicializaFormGroup() {
    //Valores y validaciones del form reactivo
    this.eventForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      fecha: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      precio: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d*\.?\,?\d*$/i),
      ]),
      imagen: new FormControl('', [Validators.required]),
    });

    this.newEvento = {
      title: this.title!.value,
      date: this.fecha!.value,
      description: this.descripcion!.value,
      price: this.precio!.value,
      image: '',
    };
  }

  //Añadir un evento
  addEvento() {
    if (this.eventForm.valid && !!this.newEvento.image) {
      this.postEvento();
    } else {
      this.compruebaCampos();
    }
  }
  postEvento() {
    this.newEvento.title = this.title!.value;
    this.newEvento.description = this.descripcion!.value;
    this.newEvento.date = this.fecha!.value;
    this.newEvento.price = +this.precio!.value.replace(',', '.');

    //Se envia al servicio el evento para que haga un post
    this.eventoService.addEvent(this.newEvento).subscribe({
      next: () => {
        //se establece el booleano en true para que el canDeactivate guard no actue
        this.isAddedEvent = true;
        //Como el evento ha sido añadido por el servicio redirijo a /eventos donde ya están todos los eventos
        this.router.navigate(['/eventos']);
        //Se muestra mensaje al usuario
        this.swal.successAlert('Evento añadido correctamente');
      },
      error: (error) => {
        //Se muestra mensaje detallado por consola
        console.error(`Error insertando
      evento!. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
        //Si hay error se muestra mensaje al usuario
        this.swal.errorAlert(
          `Se ha producido un error al añadir el evento.(Codigo error: ${error.status})`
        );
      },
    });
  }

  compruebaCampos() {
    //recorre todos los inputs y le asigna ng-touched para que ejecute las validaciones
    Object.keys(this.eventForm.controls).forEach((field) => {
      const control = this.eventForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    //Si no cumple la validación->Error mediante el modulo sweetalert2; Es un alert modificado
    this.swal.errorAlert('Hay algún input inválido');
  }

  
  public get title() {
    return this.eventForm.get('title');
  }
  public get fecha() {
    return this.eventForm.get('fecha');
  }
  public get descripcion() {
    return this.eventForm.get('descripcion');
  }
  public get precio() {
    return this.eventForm.get('precio');
  }
  public get imagen() {
    return this.eventForm.get('imagen');
  }

  //Guard que...si se ha añadido un evento retorna true y no pide confirmación para salir
  canDeactivate() {
    if (this.eventForm.touched) {
      return this.isAddedEvent
        ? true
        : confirm(
            '¿Quieres abandonar la página?. Los cambios no se guardarán.'
          );
    }
    return true;
  }

  //Recibe el file del input file, lo convierte a base64 y añade el string a la imagen del objeto newEvento
  convertBase64(fileinput: HTMLInputElement) {
    //Si no hay archivo sale
    if (!fileinput.files || fileinput.files.length === 0) {
      return;
    }
    //instancia Filereader
    const reader: FileReader = new FileReader();
    //le paso la imagen al reader
    reader.readAsDataURL(fileinput.files[0]);
    reader.addEventListener('loadend', (e) => {
      //Cuando acabe de pasarla a base64 establezco la propiedad image del evento con el resultado de la conversión como string
      this.newEvento.image = reader.result as string;
      document
        .querySelector('.imagen')
        ?.setAttribute('src', reader.result as string);
      this.showErrorImage = false;
    });
  }
}
