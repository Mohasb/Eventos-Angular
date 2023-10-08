import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { ICliente } from '../interfaces/i-cliente';
import { ClientesService } from '../services/clientes/clientes.service';

@Component({
  selector: 'clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss'],
})
export class ClientesListComponent implements OnInit {

  @Input() clientes!: ICliente[];
  @Output() clienteAEliminar = new EventEmitter<ICliente>();

  constructor(private clientService: ClientesService) {}
  ngOnInit(): void {}

  deleteCliente(cliente: ICliente) {
    Swal.fire({
      title: '¿Eliminar este Regisstro?',
      text: 'Esta acción no podrá ser revertida',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteCliente(cliente).subscribe({
          next: () => {
            this.clienteAEliminar.emit(cliente);
          },
        });
      }
    });
  }
}
