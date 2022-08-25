export interface IMovieDetails {
    id: string;
    title: string | null;
    year: number | null;
    released: string | null;
    runtime: string | null;
    genres: string[] | null;
    director: string | null;
    mainActors: string[] | null;
    plot: string | null;
    languages: string[] | null;
    poster: string | null;
    imdbRating: number | null;
    imdbVotes: number | null;
    trailer: string | null;
  }