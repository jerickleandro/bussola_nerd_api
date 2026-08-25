import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MovieRelease,
  ReleasesApiProvider,
} from './releases-api.provider.interface';

interface ReleasesApiConfig {
  baseUrl: string;
  apiKey: string;
}

interface TmdbUpcomingResponse {
  dates?: { minimum: string; maximum: string };
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieRelease[];
}

@Injectable()
export class HttpReleasesApiProvider implements ReleasesApiProvider {
  private readonly logger = new Logger(HttpReleasesApiProvider.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const cfg = this.configService.get<ReleasesApiConfig>('releasesApi');
    this.baseUrl = cfg!.baseUrl;
    this.apiKey = cfg!.apiKey;
  }

  async fetchReleasesByMonth(params: {
    year: number;
    month: number;
  }): Promise<MovieRelease[]> {
    const { year, month } = params;

    const allMovies = await this.fetchAllPages();
    const filtered = allMovies.filter((movie) => {
      if (!movie.release_date) return false;
      const d = new Date(movie.release_date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    return this.sortMovies(filtered);
  }

  private async fetchAllPages(): Promise<MovieRelease[]> {
    let totalPages = 1;
    let page = 1;
    let allMovies: MovieRelease[] = [];

    while (page <= totalPages) {
      const url = this.buildUrl(page);
      const res = await fetch(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!res.ok) {
        throw new HttpException(
          `Failed to fetch upcoming movies: ${res.status}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = (await res.json()) as TmdbUpcomingResponse;
      totalPages = data.total_pages;
      allMovies = allMovies.concat(data.results);
      page++;
    }

    return allMovies;
  }

  private buildUrl(page: number): string {
    const params = new URLSearchParams({
      language: 'pt-BR',
      region: 'BR',
      page: String(page),
    });
    return `${this.baseUrl}/movie/upcoming?${params.toString()}`;
  }

  private sortMovies(movies: MovieRelease[]): MovieRelease[] {
    return movies.sort(
      (a, b) =>
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
    );
  }
}
