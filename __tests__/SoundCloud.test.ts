import { SoundCloud, ContentType } from '../src';

describe('SoundCloud', () => {
  it('scrapes track information', async () => {
    const soundcloud = new SoundCloud();
    const content = await soundcloud.fetchContent('eric/oberholz5');

    expect(content.type).toBe(ContentType.AUDIO);
    expect(content.title).toBe('Electro 1');
    expect(content.id).toBe('2');

    expect(content.author?.id).toBe('2');
    expect(content.author?.name).toBe('eric');

    expect(content.author?.thumbnails?.length).toBeGreaterThan(0);
    expect(content.author?.thumbnails?.[0].url).toContain('sndcdn.com');
    expect(content.author?.thumbnails?.[0].width).toBeGreaterThan(0);
    expect(content.author?.thumbnails?.[0].height).toBeGreaterThan(0);
  });
});
