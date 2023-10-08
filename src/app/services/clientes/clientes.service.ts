import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, map, catchError, throwError } from 'rxjs';
import { ClienteDeleteResponse, ClientesResponse, EventosResponse, ResponseClientes } from 'src/app/interfaces/eventos-response';
import { ICliente } from 'src/app/interfaces/i-cliente';
import { IEvento } from 'src/app/interfaces/ievento';
import { EventosServiceService } from '../eventos-service.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private http: HttpClient, eventosService: EventosServiceService) {}

  //para el select
  getEventos(): Observable<IEvento[]> {
    return this.http.get<EventosResponse>('/eventos').pipe(
      retry(1),
      map((response) => {
        return response.eventos;
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }




  /*Petición POST HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos.
  Si es correcta retorna un observable<IEvento>(el evento)
  Si es incorrecta retorna el error*/
  addClient(cliente: ICliente): Observable<ICliente> {
    return this.http.post<ResponseClientes>('/clientes', cliente).pipe(
      retry(3),
      map((resp) => {
        
        return resp.cliente;
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }


  /*Petición GET HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos.
  Si es correcta retorna un observable<IEvento[]>(array de eventos)
  Si es incorrecta retorna el error*/
  getClientes(): Observable<ICliente[]> {
    return this.http.get<ClientesResponse>('/clientes').pipe(
      retry(1),
      map((response) => {
        response.clientes.forEach(cliente => {
          
          
        });
        return response.clientes
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }



 /*Petición DELETE HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos/{id}.
  Si es correcta retorna un observable<evento.id>
  Si es incorrecta retorna el error*/
  deleteCliente(cliente: ICliente): Observable<ClienteDeleteResponse> {
    return this.http.delete<ClienteDeleteResponse>(`/clientes/${cliente.id}`).pipe(
      retry(3),
      map((resp) => {
        return resp;
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }

//Retorna un evento de id passado por parámetro
getCliente(id:number): Observable<ICliente> {
  return this.http.get<ResponseClientes>(`/clientes/${id}`).pipe(
    map(resp => resp.cliente),
    catchError((respError: HttpErrorResponse) => throwError(() => respError))
  )
}







}
