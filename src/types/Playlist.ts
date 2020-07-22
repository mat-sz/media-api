import { ContentThumbnail } from './Content';

export interface Playlist {
  id: string;
  title: string;
  thumbnails?: ContentThumbnail[];
}
