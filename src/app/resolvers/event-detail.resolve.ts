import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { IEvento } from '../interfaces/ievento';
import { EventosServiceService } from '../services/eventos-service.service';

@Injectable({
  providedIn: 'root'
})

//Este resolve se usa para obtener el evento antes de renderizar el componente de evento-detail
export class EventDetailResolve implements Resolve<IEvento> {

  constructor(private eventService: EventosServiceService, private router:Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IEvento> {
    const id = +route.params['id'];
    return this.eventService.getEvento(id).pipe(
      catchError(() => {
        //si hay error manda a 404
        this.router.navigate(['/error']);
        return of();
      })
    );
  }
}
