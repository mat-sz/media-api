import { YouTube, ContentType } from '../src';

describe('YouTube', () => {
  it('scrapes video information', async () => {
    const youtube = new YouTube();
    const content = await youtube.fetchContent('jNQXAC9IVRw');

    expect(content.type).toBe(ContentType.VIDEO);
    expect(content.title).toBe('Me at the zoo');
    expect(content.id).toBe('jNQXAC9IVRw');

    expect(content.author?.id).toBe('UC4QobU6STFB0P71PMvOGN5A');
    expect(content.author?.name).toBe('jawed');

    expect(content.author?.thumbnails?.length).toBeGreaterThan(0);
    expect(content.author?.thumbnails?.[0].url).toContain('ggpht.com');
    expect(content.author?.thumbnails?.[0].width).toBeGreaterThan(0);
    expect(content.author?.thumbnails?.[0].height).toBeGreaterThan(0);

    expect(content.streams?.length).toBeGreaterThan(0);
    expect(content.streams?.[0].url).toContain('googlevideo.com');

    expect(content.thumbnails?.length).toBeGreaterThan(0);
    expect(content.thumbnails?.[0].url).toContain('ytimg.com');
    expect(content.thumbnails?.[0].width).toBeGreaterThan(0);
    expect(content.thumbnails?.[0].height).toBeGreaterThan(0);
  });
});
