import { YouTube, ContentType } from '../src';

describe('YouTube', () => {
  it('scrapes video information', async () => {
    const youtube = new YouTube();
    const content = await youtube.fetchContent('jNQXAC9IVRw');
    expect(content.type).toBe(ContentType.VIDEO);
    expect(content.title).toBe('Me at the zoo');
    expect(content.id).toBe('jNQXAC9IVRw');
  });
});
