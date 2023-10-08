import { ICliente } from './i-cliente';
import { IEvento } from './ievento';

//interfaz que es usada para el GET de eventos
export interface EventosResponse {
  eventos: IEvento[];
}

//Interfaz que detalla la respuesta del servidor al hacer un POST
export interface ResponseEventos {
  ok: boolean;
  evento: IEvento;
  error?: string;
}
//Interfaz que es usada para el DELETE de un evento
export interface EventoDeleteResponse {
  ok: boolean;
  idEvento: number;
  error?: string;
}

////////////////////////////////////////////////////////////


export interface ClientesResponse {
  clientes: ICliente[];
}
//Interfaz que detalla la respuesta del servidor al hacer un POST
export interface ResponseClientes {
  ok: boolean;
  cliente: ICliente;
  error?: string;
}

export interface ClienteDeleteResponse {
  ok: boolean;
  idCliente: number;
  error?: string;
}