export const SPOTIFY_PROVIDER = 'SPOTIFY_PROVIDER';

export interface SpotifyProvider {
  fetchEpisodes(): Promise<any[]>;
}
