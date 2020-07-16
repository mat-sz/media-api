import { Content } from './Content';

export interface Service {
  fetchContent(id: string): Promise<Content>;
}
