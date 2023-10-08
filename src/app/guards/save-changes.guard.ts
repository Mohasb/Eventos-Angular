import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

//Guard que pregunta si el usuario puede quiere abandonar el componente 
//Es usado en el evento-add para avisar que se perderán los cambios si abandona a medio añadir un evento

export interface ComponentDeactivate {
  canDeactivate: () =>
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>;
}

@Injectable({
  providedIn: 'root',
})
export class SaveChangesGuard implements CanDeactivate<ComponentDeactivate> {
  canDeactivate(
    component: ComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return component.canDeactivate ? component.canDeactivate(): true;
  }
}
