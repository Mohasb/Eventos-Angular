import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { ICliente } from '../interfaces/i-cliente';
import { IEvento } from '../interfaces/ievento';
import { ClientesService } from '../services/clientes/clientes.service';

@Injectable({
  providedIn: 'root'
})
export class ClientEditService {

  constructor(private clientService: ClientesService, private router:Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ICliente> {
    const id = +route.params['id'];
    return this.clientService.getCliente(id).pipe(
      catchError(() => {
        //si hay error manda a 404
        this.router.navigate(['/error']);
        return of();
      })
    );
  }
}
