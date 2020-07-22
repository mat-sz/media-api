import { Thumbnail } from './Thumbnail';
import { Author } from './Author';

export enum ContentType {
  VIDEO = 'video',
  LIVE_STREAM = 'live_stream',
  AUDIO = 'audio',
  IMAGE = 'image',
}

export enum ContentStreamType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export interface ContentStatistics {
  plays?: number;
  likes?: number;
  dislikes?: number;
}

export interface ContentStream {
  url: string;
  type: ContentStreamType;
  width?: number;
  height?: number;
  label?: string;
  fps?: number;
  bitrate?: number;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  duration?: number;
  statistics?: ContentStatistics;
  streams?: ContentStream[];
  thumbnails?: Thumbnail[];
  keywords?: string[];
  author?: Author;
  date?: Date;
}
