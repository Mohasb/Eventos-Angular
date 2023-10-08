import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ComponentDeactivate } from '../guards/save-changes.guard';
import { IEvento } from '../interfaces/ievento';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { EventosServiceService } from '../services/eventos-service.service';

@Component({
  selector: 'evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.scss'],
})
export class EventoEditComponent implements OnInit, ComponentDeactivate {
  eventForm!: FormGroup;
  //booleano que determina si se ha añadido o no un evento para evitar el canDeactivate guard
  isEditedEvent: boolean = false;

  oldEvent!: IEvento;
  editedEvent!: IEvento;
  imageBase64!: string;

  constructor(
    private eventoService: EventosServiceService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private swal: SwalAlertService
  ) {}

  ngOnInit(): void {
    //Establece un title personalizado
    this.titleService.setTitle('Editar evento');
    this.inicializaFormGroup();
    this.setValoresFormGroup();
  }

  addEvento() {
    if (this.eventForm.valid) {
      this.editedEvent = {
        id: this.oldEvent.id,
        title: this.title!.value,
        description: this.descripcion!.value,
        date: this.fecha!.value,
        price: +this.precio!.value.replace(',', '.'),
        image: document.getElementById('imagen')?.getAttribute('src') as string,
      };
      this.actualizaEvento();
      this.isEditedEvent = true;

    } else {
      this.swal.errorAlert('Hay algún input inválido');
    }
  }

  actualizaEvento() {

    //elimino el evento antiguo
    this.eventoService.deleteEvento(this.oldEvent).subscribe()

    this.eventoService.addEvent(this.editedEvent).subscribe({
      next: () => {
        //Como el evento ha sido añadido por el servicio redirijo a /eventos donde ya están todos los eventos
        this.router.navigate(['/eventos']);
        //Se muestra mensaje al usuario
        this.swal.successAlert('Evento editado correctamente');
      },error: (error) => {
        //Se muestra mensaje detallado por consola
        console.error(`Error insertando
      evento!. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
        //Si hay error se muestra mensaje al usuario
        this.swal.errorAlert(
          `Se ha producido un error al editar el evento.(Código error: ${error.status})`
        );
      }
    })

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
      imagen: new FormControl('', [
        Validators.required
      ])
    });
  }

  setValoresFormGroup() {
    //Obtengo el evento mediante el resolve
    this.oldEvent = this.route.snapshot.data['evento'];
    
    //Valores y validaciones del form reactivo
    this.eventForm = new FormGroup({
      title: new FormControl(`${this.oldEvent.title}`, [
        Validators.required,
        Validators.minLength(2),
      ]),
      fecha: new FormControl(`${this.oldEvent.date}`, [
        Validators.required,
      ]),
      descripcion: new FormControl(`${this.oldEvent.description}`, [
        Validators.required,
        Validators.minLength(5),
      ]),
      precio: new FormControl(`${this.oldEvent.price}`, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d*\.?\,?\d*$/i),
      ]),
    });

    this.obtenerImagenActual(this.oldEvent.image);

    /* this.eventoService.getEvento(id).subscribe({
      next: (evto) => {
        this.oldEvent = evto;

        //Valores y validaciones del form reactivo
        this.eventForm = new FormGroup({
          title: new FormControl(`${this.oldEvent.title}`, [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-z0-9 ,.'-]+$/i),
          ]),
          fecha: new FormControl(`${this.oldEvent.date}`, [
            Validators.required,
          ]),
          descripcion: new FormControl(`${this.oldEvent.description}`, [
            Validators.required,
            Validators.minLength(5),
          ]),
          precio: new FormControl(`${this.oldEvent.price}`, [
            Validators.required,
            Validators.min(0),
            Validators.pattern(/^\d*\.?\,?\d*$/i),
          ]),
        });

        this.obtenerImagenActual(this.oldEvent.image);
      },
    }); */
  }

  obtenerImagenActual(urlImagen: string) {
    // Obtener la imagen del servidor con la api fetch

    fetch(urlImagen)
      .then((res) => res.blob())
      .then((blob) => {

        // Read the Blob as DataURL using the FileReader API
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageBase64 = reader.result as string;

          document
            .querySelector('.imagen')
            ?.setAttribute('src', reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
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
      return this.isEditedEvent
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
      //this.newEvento.image = reader.result as string;
      document
        .querySelector('.imagen')
        ?.setAttribute('src', reader.result as string);
    });

    
  }
  //Guard que comprueba que la vista de detalles de un evento proporcione un id válido
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    
    const id = +route.params['id'];
    
    if (isNaN(id) || id < 1) {
      //La ruta /error no existe-> entrará en el path '**' que manda a 404
      return this.router.createUrlTree(['/error']);
    }
    return true;
  }
}
