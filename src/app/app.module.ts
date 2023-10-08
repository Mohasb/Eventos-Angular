import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//El componente de eventos
import { EventosShowComponent } from './eventos-show/eventos-show.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventFilterPipe } from './pipes/event-filter.pipe';
import { EventoItemComponent } from './evento-item/evento-item.component';
import { EventoAddComponent } from './evento-add/evento-add.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptors/interceptor.service';
import { Route, RouterModule } from '@angular/router';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { SaveChangesGuard } from './guards/save-changes.guard';
import { EventDetailResolve } from './resolvers/event-detail.resolve';
import { EventDetailGuard } from './guards/event-detail/event-detail.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClientesAddComponent } from './clientes-add/clientes-add.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { EventoEditComponent } from './evento-edit/evento-edit.component';
import { ClientesEditComponent } from './clientes-edit/clientes-edit.component';
import { EventEditService } from './resolvers/event-edit.service';
import { ClientEditService } from './resolvers/client-edit.service';

//Constante de tipo ROUTE con las rutas de la aplicación y a que componente corresponden
const APP_ROUTES: Route[] = [
  { path: 'eventos', component: EventosShowComponent },
  {
    path: 'eventos/add',
    canDeactivate: [SaveChangesGuard],
    component: EventoAddComponent,
  },
  {
    path: 'eventos/:id',
    canActivate: [EventDetailGuard],
    component: EventDetailComponent,
    resolve: {
      evento: EventDetailResolve,
    },
  },{
    path: 'eventos/edit/:id',
    canDeactivate: [SaveChangesGuard],
    component: EventoEditComponent,
    resolve: {
      evento: EventEditService,
    },
  },
  {
    path: 'clientes/add',
    canDeactivate: [SaveChangesGuard],
    component: ClientesAddComponent,
  },
  {
    path: 'cliente/edit/:id',
    canDeactivate: [SaveChangesGuard],
    component: ClientesEditComponent,
    resolve: {
      cliente: ClientEditService,
    },
  },
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    //El componente de eventos
    EventosShowComponent,
    //El PIPE personalizado para filtrar eventos
    EventFilterPipe,
    //Componente de cada evento
    EventoItemComponent,
    //Componente con el formulario de introducción de eventos
    EventoAddComponent,
    EventDetailComponent,
    PageNotFoundComponent,
    ClientesAddComponent,
    NavbarComponent,
    ClientesListComponent,
    EventoEditComponent,
    ClientesEditComponent,
  ],
  imports: [
    BrowserModule,
    //Para poder usar [(ngModel)]
    FormsModule,
    //Para usar los métodos http
    HttpClientModule,
    //Declara las routes que se van a utilizar
    RouterModule.forRoot(APP_ROUTES),
    //Form reactivo de clientesAdd
    ReactiveFormsModule,
    //Animaciones e modulo de angular material
    BrowserAnimationsModule,
    AppMaterialModule,
  ],
  providers: [
    {
      //El interceptor http que se va a usar,nombre de la clase, ?
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  //estilos
  bootstrap: [AppComponent],
})
export class AppModule {}
