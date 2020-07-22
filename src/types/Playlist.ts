import { Thumbnail } from './Thumbnail';
import { Author } from './Author';

export interface Playlist {
  id: string;
  title: string;
  thumbnails?: Thumbnail[];
  author?: Author;
}
