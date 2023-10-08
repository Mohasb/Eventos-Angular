import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDeactivate } from '../guards/save-changes.guard';
import { ICliente } from '../interfaces/i-cliente';
import { IEvento } from '../interfaces/ievento';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { ClientesService } from '../services/clientes/clientes.service';

@Component({
  selector: 'clientes-edit',
  templateUrl: './clientes-edit.component.html',
  styleUrls: ['./clientes-edit.component.scss'],
})
export class ClientesEditComponent implements OnInit, ComponentDeactivate {
  //objeto FormGroup del formulario de gestión de clientes
  clientForm!: FormGroup;
  eventos: IEvento[] = [];
  cliente!: ICliente;
  eventoSeleccionado!: string;
  isEditedClient: boolean = false;

  constructor(
    private titleService: Title,
    private clientService: ClientesService,
    private swal: SwalAlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    //Establece un title personalizado
    this.titleService.setTitle('Editar cliente');
    //carga el select con los eventos
    this.cargaEventosSelect();
    //Inicializa el formGroup
    this.inicializaFormGroup();
    //Pone los valores del cliente a editar en los inputs
    this.setValoresFormGroup();
  }

  cargaEventosSelect() {
    //carga los eventos del select
    this.clientService.getEventos().subscribe({
      next: (evts) => {
        //Al recibir los eventos del servicio los asigna a la variable eventos que es utilizada en el html para mostrar el nombre y la fecha
        this.eventos = evts;
      },
    });
  }
  inicializaFormGroup() {
    //Valores y validaciones del form reactivo
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
      eventos: new FormControl(''),
    });
  }
  setValoresFormGroup() {

    //obtener cliente mediante el resolve
    this.cliente = this.route.snapshot.data['cliente'];

    this.clientForm = new FormGroup({
      id: new FormControl(),
      nombre: new FormControl(`${this.cliente.nombre}`, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-z0-9 ,.'-]+$/i),
      ]),
      apellidos: new FormControl(`${this.cliente.apellido}`, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-z ,.'-]+$/i),
      ]),
      nif: new FormControl(`${this.cliente.nif}`, [
        Validators.required,
        Validators.pattern(/^[0-9]{8}[a-zA-Z]{1}$/i),
      ]),
      direccion: new FormControl(`${this.cliente.direccion}`, [
        Validators.required,
        Validators.minLength(10),
      ]),
      eventos: new FormControl(''),
    });

  }

  addCliente() {
    if (this.clientForm.valid) {
      this.actualizaCliente();
      this.isEditedClient = true;
    } else {
      this.swal.errorAlert('Hay algún input inválido');
    }
  }
  

  actualizaCliente() {
    this.clientService.deleteCliente(this.cliente).subscribe({
      next: (eliminado) => {
        console.log(eliminado);
      },
    });
    this.cliente = {
      nombre: this.nombre!.value,
      apellido: this.apellidos!.value,
      nif: this.nif!.value,
      direccion: this.direccion!.value,
      evento:
        +this.evento!.value == 0 ? this.cliente.evento : +this.evento!.value,
    };

    this.clientService.addClient(this.cliente).subscribe({
      next: (added) => {
        
        //Como el evento ha sido añadido por el servicio redirijo a /eventos donde ya están todos los eventos
        this.router.navigate(['/clientes/add']);
        //Se muestra mensaje al usuario
        this.swal.successAlert('Cliente editado correctamente');
      },
      error: (error) => {
        //Se muestra mensaje detallado por consola
        console.error(`Error editando
      cliente!. Código de servidor: ${error.status}. Mensaje: ${error.message}`);
        //Si hay error se muestra mensaje al usuario
        this.swal.errorAlert(
          `Se ha producido un error al editar el cliente.(Codigo error: ${error.status})`
        );
      },
    });
  }

  

  //helpers para obtener los campos del form
  public get nombre() {
    return this.clientForm.get('nombre');
  }
  public get apellidos() {
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

  //Guard que...si se ha añadido un cliente retorna true y no pide confirmación para salir
  canDeactivate() {
     if (this.clientForm.touched) {
      return this.isEditedClient
        ? true
        : confirm(
            '¿Quieres abandonar la página?. Los cambios no se guardarán.'
          );
    }
    return true; 
  }
}
