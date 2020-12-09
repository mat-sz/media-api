import { Content } from './Content';
import { Playlist } from './Playlist';
import { SearchResults } from './SearchResults';

export interface Service {
  content(id: string): Promise<Content>;
  playlist?(id: string): Promise<Playlist>;
  search?(text: string): Promise<SearchResults>;
}
