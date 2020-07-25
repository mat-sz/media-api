import fetch, { RequestInit, Response } from 'node-fetch';

import { Content, ContentType } from '../../types/Content';
import { Service } from '../../types/Service';

interface DataBlock {
  id: number;
  chunks: number[];
  data: any;
}

interface ContentTranscoding {
  url: string;
  preset: string;
  duration: number;
  snipped: boolean;
  format: { protocol: string; mime_type: string };
  quality: string;
}

interface Product {
  product: { id: string };
}

interface User {
  avatar_url: string;
  city: string;
  comments_count: number;
  country_code: string;
  created_at: string;
  creator_subscriptions: Product[];
  creator_subscription: Product;
  description: string;
  followers_count: number;
  followings_count: number;
  first_name: string;
  full_name: string;
  groups_count: number;
  id: number;
  kind: string;
  last_modified: string;
  last_name: string;
  likes_count: number;
  playlist_likes_count: number;
  permalink: string;
  permalink_url: string;
  playlist_count: number | null;
  reposts_count: number | null;
  track_count: number | null;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
  visuals: {
    urn: string;
    enabled: boolean;
    visuals: [
      {
        urn: string;
        entry_time: number;
        visual_url: string;
      }
    ];
    tracking: string | null;
  };
}

interface Track {
  comment_count: number;
  full_duration: number;
  downloadable: boolean;
  created_at: string;
  description: string;
  media: {
    transcodings: ContentTranscoding[];
  };
  title: string;
  publisher_metadata: { urn: string; id: number };
  duration: number;
  has_downloads_left: boolean;
  artwork_url: string | null;
  public: boolean;
  streamable: boolean;
  tag_list: string;
  genre: string;
  id: number;
  reposts_count: number;
  state: string;
  label_name: string | null;
  last_modified: string;
  commentable: boolean;
  policy: string;
  visuals: string | null;
  kind: string;
  purchase_url: string | null;
  sharing: string;
  uri: string;
  secret_token: string | null;
  download_count: number;
  likes_count: number;
  urn: string;
  license: string;
  purchase_title: string | null;
  display_date: string;
  embeddable_by: string;
  release_date: string | null;
  user_id: number;
  monetization_model: string;
  waveform_url: string;
  permalink: string;
  permalink_url: string;
  user: User;
  playback_count: number;
}

export class SoundCloud implements Service {
  async content(id: string): Promise<Content> {
    const res = await this.fetch(id);

    const body = await res.text();
    const track = this.scrapeTrack(body);

    return {
      type: ContentType.AUDIO,
      id: track.id.toString(),
      title: track.title,
      author: {
        id: track.user.id.toString(),
        name: track.user.permalink,
        thumbnails: [
          {
            url: track.user.avatar_url,
            height: 100,
            width: 100,
          },
        ],
      },
    };
  }

  private fetch(url: string, init?: RequestInit): Promise<Response> {
    if (!init) {
      init = {};
    }

    init.headers = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-us,en;q=0.5',
      'cache-control': 'max-age=0',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
      'x-youtube-client-name': '1',
    };

    return fetch('https://soundcloud.com/' + url, init);
  }

  private scrapeData(body: string): DataBlock[] {
    const regex = new RegExp(/catch\(t\){}}\)},(.*?)\);/);
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Content unavailable.');
    }

    const data = JSON.parse(match[1]) as DataBlock[];

    if (data.length === 0) {
      throw new Error('Content unavailable.');
    }

    return data;
  }

  private scrapeTrack(body: string): Track {
    const data = this.scrapeData(body);
    const block = data.find(
      block => typeof block.data[0] === 'object' && 'media' in block.data[0]
    );

    if (!block) {
      throw new Error('Content unavailable.');
    }

    return block.data[0] as Track;
  }
}
