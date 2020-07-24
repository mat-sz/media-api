import { Content } from './Content';
import { Playlist } from './Playlist';
import { SearchResults } from './SearchResults';

export interface Service {
  fetchContent(id: string): Promise<Content>;
  fetchPlaylist?(id: string): Promise<Playlist>;
  search?(id: string): Promise<SearchResults>;
}
