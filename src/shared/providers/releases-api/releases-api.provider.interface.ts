export const RELEASES_API_PROVIDER = 'RELEASES_API_PROVIDER';

export interface MovieRelease {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ReleasesApiProvider {
  fetchReleasesByMonth(params: {
    year: number;
    month: number;
  }): Promise<MovieRelease[]>;
}
