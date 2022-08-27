import { Pipe, PipeTransform } from '@angular/core';
import { ITheaterHall } from '../domain/models/theater-hall.model';

@Pipe({
  name: 'sortByTheaterHallName'
})
export class SortByTheaterHallNamePipe implements PipeTransform {

  transform(projections: ITheaterHall[]): ITheaterHall[] {
    return projections.sort(
      (proj1, proj2) => 0 - (proj1.name < proj2.name ? 1 : -1)
    );
  }

}
