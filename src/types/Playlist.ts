import { Thumbnail } from './Thumbnail';
import { Author } from './Author';
import { Content } from './Content';

export interface Playlist {
  id: string;
  title: string;
  thumbnails?: Thumbnail[];
  author?: Author;
  contents?: Content[];
}
