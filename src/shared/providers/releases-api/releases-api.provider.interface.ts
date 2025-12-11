export const RELEASES_API_PROVIDER = 'RELEASES_API_PROVIDER';

export interface ReleasesApiProvider {
  fetchReleasesByMonth(params: { year: number; month: number }): Promise<any[]>; // depois tipa melhor
}
