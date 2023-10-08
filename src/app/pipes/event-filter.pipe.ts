import { Pipe, PipeTransform } from '@angular/core';
//Para poder usar eventos y IEvento
import { IEvento } from '../interfaces/ievento';

@Pipe({
  //Nombre del filtro
  name: 'eventFilter'
})
export class EventFilterPipe implements PipeTransform {

  //Recibe un array de eventos de tipo IEvento y un string. Retorna un array de tipo IEvento
  transform(eventos: IEvento[], filterBy: string): IEvento[] {

    //.normalize("NFD").replace(/[\u0300-\u036f]/g, "")----------->normalizar texto /quitar acentos
    
    //Crea variable que contendrá el filtro a minúsculas
    const filter = filterBy ? filterBy.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""): null;
    //Si se ha escrito filtro...
    if (filter) {      
      //Retorna los eventos filtrados donde el titulo del evento o la descripción del evento contenga el texto del filtro
      return eventos.filter(evento => (evento.title.toLocaleLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter) || (evento.description.toLocaleLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter));
      
    }
    //Si no hay filtro(texto) retorna todos los eventos
    return eventos;
    
  }

}
