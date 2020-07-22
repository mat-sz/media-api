import { YouTube, ContentType } from '../src';

describe('YouTube', () => {
  it('scrapes video information', async () => {
    const youtube = new YouTube();
    const content = await youtube.fetchContent('jNQXAC9IVRw');

    expect(content.type).toBe(ContentType.VIDEO);
    expect(content.title).toBe('Me at the zoo');
    expect(content.id).toBe('jNQXAC9IVRw');
    expect(content.duration).toBe(19);
    expect(content.keywords).toContain('me at the zoo');
    expect(content.description).toContain('The first video on YouTube.');
    expect(content.date?.getFullYear()).toBe(2005);

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

    expect(content.statistics?.plays).toBeGreaterThan(100000000);
    expect(content.statistics?.likes).toBeGreaterThan(3500000);
    expect(content.statistics?.dislikes).toBeGreaterThan(100000);
  });

  it('scrapes playlist information', async () => {
    const youtube = new YouTube();
    const playlist = await youtube.fetchPlaylist('PL5BF9E09ECEC8F88F');

    expect(playlist.id).toBe('PL5BF9E09ECEC8F88F');
    expect(playlist.title).toBe('4k Resolution');

    expect(playlist.thumbnails?.length).toBeGreaterThan(0);
    expect(playlist.thumbnails?.[0].url).toContain('ytimg.com');
    expect(playlist.thumbnails?.[0].width).toBeGreaterThan(0);
    expect(playlist.thumbnails?.[0].height).toBeGreaterThan(0);

    expect(playlist.author?.id).toBe('UCBR8-60-B28hp2BmDPdntcQ');
    expect(playlist.author?.name).toBe('YouTube');

    expect(playlist.author?.thumbnails?.length).toBeGreaterThan(0);
    expect(playlist.author?.thumbnails?.[0].url).toContain('ggpht.com');
    expect(playlist.author?.thumbnails?.[0].width).toBeGreaterThan(0);
    expect(playlist.author?.thumbnails?.[0].height).toBeGreaterThan(0);
  });
});
