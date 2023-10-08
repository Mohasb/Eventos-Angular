import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import {
  EventoDeleteResponse,
  EventosResponse,
  ResponseEventos,
} from '../interfaces/eventos-response';
import { IEvento } from '../interfaces/ievento';

@Injectable({
  providedIn: 'root',
})

export class EventosServiceService {
  
  constructor(private http: HttpClient) {}


  /*Petición GET HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos.
  Si es correcta retorna un observable<IEvento[]>(array de eventos)
  Si es incorrecta retorna el error*/
  getEventos(): Observable<IEvento[]> {
    return this.http.get<EventosResponse>('/eventos').pipe(
      retry(1),
      map((response) => response.eventos),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }

  /*Petición POST HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos.
  Si es correcta retorna un observable<IEvento>(el evento)
  Si es incorrecta retorna el error*/
  addEvent(evento: IEvento): Observable<IEvento> {
    return this.http.post<ResponseEventos>('/eventos', evento).pipe(
      retry(3),
      map((resp) => {        
        return resp.evento;
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }

  /*Petición DELETE HTTP.Interceptada por el interceptor para modificar la url y añadir /eventos/{id}.
  Si es correcta retorna un observable<evento.id>
  Si es incorrecta retorna el error*/
  deleteEvento(evento: IEvento): Observable<EventoDeleteResponse> {
    return this.http.delete<EventoDeleteResponse>(`/eventos/${evento.id}`).pipe(
      retry(3),
      map((resp) => {
        return resp;
      }),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    );
  }

  //Retorna un evento de id passado por parámetro
  getEvento(id:number): Observable<IEvento> {
    return this.http.get<ResponseEventos>(`/eventos/${id}`).pipe(
      map(resp => resp.evento),
      catchError((respError: HttpErrorResponse) => throwError(() => respError))
    )
  }
}
