import { Thumbnail } from './Thumbnail';

export interface Author {
  name: string;
  id: string;
  url?: string;
  thumbnails?: Thumbnail[];
}
