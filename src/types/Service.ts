import { Content } from './Content';
import { Playlist } from './Playlist';

export interface Service {
  fetchContent(id: string): Promise<Content>;
  fetchPlaylist(id: string): Promise<Playlist>;
}
