import { Pipe, PipeTransform } from '@angular/core';
import { IProjection } from '../domain/models/projection.model';

@Pipe({
  name: 'sortByMovieName'
})
export class SortByMovieNamePipe implements PipeTransform {

  transform(projections: IProjection[]): IProjection[] {
    return projections.sort(
      (proj1, proj2) => 0 - (proj1.movieTitle > proj2.movieTitle ? 1 : -1)
    );
  }

}
