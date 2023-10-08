import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComponentDeactivate } from '../guards/save-changes.guard';
import { ICliente } from '../interfaces/i-cliente';
import { IEvento } from '../interfaces/ievento';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { ClientesService } from '../services/clientes/clientes.service';
import { EventosServiceService } from '../services/eventos-service.service';

@Component({
  selector: 'clientes-add',
  templateUrl: './clientes-add.component.html',
  styleUrls: ['./clientes-add.component.scss'],
})
export class ClientesAddComponent implements ComponentDeactivate {
  //objeto FormGroup del formulario de gestión de clientes
  clientForm!: FormGroup;
  //El cliente de tipo ICliente que sera añadido a la base de datos
  cliente!: ICliente;
  //array de clientes que será pasado al hijo para mostrarse
  clientes:ICliente[] = [];
  //Array de eventos que serán los mostrados en el select del form
  eventos: IEvento[] = [];
  //Variable que controla si se ha añadido un cliente y si es asi no pide confirmación para salir
  isAddedCliente: boolean = false;

  constructor(
    private titleService: Title,
    private clientService: ClientesService,
    private swal: SwalAlertService,
    private eventsService: EventosServiceService
  ) {}
  ngOnInit() {
    //title de la vista
    this.titleService.setTitle(`Registrar cliente`);
    //carga eventos del select
    this.cargaEventosSelect();
    this.inicializaFormGroup();
    this.getClientes();    
  }
  //carga eventos del select
  cargaEventosSelect() {
    //carga los eventos del select
    this.clientService.getEventos().subscribe({
      next: (evts) => {
        //Al recibir los eventos del servicio los asigna a la variable eventos que es utilizada en el html para mostrar el nombre y la fecha
        this.eventos = evts;
      },
    });
  }
  //Valores y validaciones del form reactivo  
  inicializaFormGroup() {
    this.clientForm = new FormGroup({
      id: new FormControl(),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-z0-9 ,.'-]+$/i),
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-z ,.'-]+$/i),
      ]),
      nif: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{8}[a-zA-Z]{1}$/i),
      ]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      eventos: new FormControl('', Validators.required),
    });
  }

  //El hacer submit si todo es válido añade al cliente
  addCliente(formDirective: FormGroupDirective) {
    if (this.clientForm.valid) {
      //Guarda cliente en la base de datos
      this.postCliente(formDirective);
    } else {
      //Recorre todos los inputs y le asigna ng-touched para que ejecute las validaciones
      this.compruebaCampos();
    }
  }
  //Guarda cliente en la base de datos
  postCliente(formDirective: FormGroupDirective) {
    this.cliente = {
      //El id lo añade la base de datos(auto increment)
      nombre: this.nombre!.value,
      apellido: this.apellido!.value,
      nif: this.nif!.value,
      direccion: this.direccion!.value,
      evento: +this.evento!.value,
    };

    this.clientService.addClient(this.cliente).subscribe({
      next: (cliente) => {
        //quita guard
        this.isAddedCliente = true;
        this.swal.successAlert(
          `Se ha anadido a ${cliente.nombre} correctamente`
        );

        this.getClientes();
      },
      error: (error) => {
        //Se muestra mensaje detallado por consola
        console.error(`Error insertando
      cliente!. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
        //Si hay error se muestra mensaje al usuario
        this.swal.errorAlert(
          `Se ha producido un error al añadir el cliente.(Codigo error: ${error.status})`
        );
      },
    });
    //reset form
    formDirective.resetForm();
    this.clientForm.reset();
  }


  getClientes() {
    this.clientService.getClientes().subscribe({
      next: (clts) => {
        this.clientes = clts;        
        this.clientes.forEach((cliente) => {
          this.eventsService.getEvento(cliente.evento).subscribe({
            next: (evento) => {
              cliente.eventoTitle =
                evento.title +
                ', ' +
                new Date(evento.date).toLocaleDateString('es-Es');
            },
          });
        });
        
      }
    })
  }

  eliminaCliente(clienteAEliminar:ICliente) {
    this.clientes = this.clientes.filter(cliente => cliente !== clienteAEliminar)
  }


  //Recorre todos los inputs y le asigna ng-touched para que ejecute las validaciones
  compruebaCampos() {
    Object.keys(this.clientForm.controls).forEach((field) => {
      const control = this.clientForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    this.swal.errorAlert('Hay algún input inválido');
  }

  //Guard que...si se ha añadido un cliente retorna true y no pide confirmación para salir
  canDeactivate() {
    if (this.clientForm.touched) {
      return this.isAddedCliente
        ? true
        : confirm(
            '¿Quieres abandonar la página?. Los cambios no se guardarán.'
          );
    }
    return true;
  }

  //helpers para obtener los campos del form
  public get nombre() {
    return this.clientForm.get('nombre');
  }
  public get apellido() {
    return this.clientForm.get('apellidos');
  }
  public get nif() {
    return this.clientForm.get('nif');
  }
  public get direccion() {
    return this.clientForm.get('direccion');
  }
  public get evento() {
    return this.clientForm.get('eventos');
  }
}
