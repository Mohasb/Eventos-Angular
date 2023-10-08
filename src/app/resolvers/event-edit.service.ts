import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { IEvento } from '../interfaces/ievento';
import { EventosServiceService } from '../services/eventos-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventEditService {

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
