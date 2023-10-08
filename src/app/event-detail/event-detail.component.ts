import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { IEvento } from '../interfaces/ievento';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent {
  //Variable que será rellenada po el guard resolve
  evento!: IEvento;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private location: Location
  ) {}

  ngOnInit() {
    //Obtener el id de la url
    const id = +this.route.snapshot.params['id'];
    //Asignar el evento vacío de esta clase al evento proporcionado por el guard resolve
    this.evento = this.route.snapshot.data['evento'];
    //Establece el title de la vista personalizado
    this.titleService.setTitle(`Detalle evento ${id}`);
  }

  goBack() {
    //Retorna a /eventos. El evento se ha borrado en evento-item-component eventoEliminar()
    //this.router.navigate(['/eventos']);
    this.location.back()
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
