import { SoundCloud, ContentType } from '../src';

describe('SoundCloud', () => {
  it('scrapes track information', async () => {
    const soundcloud = new SoundCloud();
    const content = await soundcloud.fetchContent('eric/oberholz5');

    expect(content.type).toBe(ContentType.AUDIO);
    expect(content.title).toBe('Electro 1');
    expect(content.id).toBe('2');
  });
});
