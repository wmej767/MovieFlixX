
export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  media_type?: 'movie';
  genres?: Genre[];
  runtime?: number;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  media_type?: 'tv';
  genres?: Genre[];
  episode_run_time?: number[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  media_type: 'person';
  known_for_department: string;
}

export interface Cast extends Person {
  character: string;
  credit_id: string;
}

export interface Crew extends Person {
  job: string;
  credit_id: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
