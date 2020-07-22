import { ContentThumbnail, ContentAuthor } from './Content';

export interface Playlist {
  id: string;
  title: string;
  thumbnails?: ContentThumbnail[];
  author?: ContentAuthor;
}
