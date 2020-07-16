import fetch, { RequestInit, Response } from 'node-fetch';

import { Content, ContentType } from '../types/Content';
import { Service } from '../types/Service';

interface PlayerResponse {
  responseContext?: any;
  playabilityStatus: {
    status: 'OK' | 'UNPLAYABLE';
    reason?: string;
    playableInEmbed?: boolean;
    miniplayer?: any;
    contextParams?: string;
    errorScreen?: {
      playerErrorMessageRenderer?: {
        reason?: {
          simpleText?: string;
        };
        subreason?: {
          simpleText?: string;
        };
      };
    };
  };
  playerAds?: any[];
  playbackTracking?: any;
  captions?: any;
  videoDetails: {
    videoId: string;
    title: string;
    lengthSeconds: string;
    keywords?: string[];
    channelId: string;
    isOwnerViewing?: boolean;
    shortDescription?: string;
    isCrawlable?: boolean;
    thumbnail?: {
      thumbnails?: any[];
    };
    useCipher?: boolean;
    averageRating?: number;
    allowRatings?: boolean;
    viewCount?: string;
    author: string;
    isPrivate?: boolean;
    isUnpluggedCorpus?: boolean;
    isLiveContent?: string;
  };
  annotations?: any[];
  playerConfig?: any;
  storyboards?: any;
  microformat?: any;
  trackingParams?: string;
  attestation?: any;
  messages?: any[];
  endscreen?: any;
  adPlacements?: any[];
}

export class YouTube implements Service {
  async fetchContent(id: string): Promise<Content> {
    const res = await this.fetch(
      `watch?v=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const playerResponse = this.scrapeVideoPage(body);

    if (playerResponse.videoDetails.videoId !== id) {
      throw new Error("Video ID doesn't match.");
    }

    return {
      type: ContentType.VIDEO,
      id: id,
      title: playerResponse.videoDetails.title,
    };
  }

  private fetch(url: string, init?: RequestInit): Promise<Response> {
    if (!init) {
      init = {};
    }

    init.headers = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'accept-charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-us,en;q=0.5',
      'cache-control': 'max-age=0',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
      'x-youtube-client-name': '1',
    };

    return fetch('https://www.youtube.com/' + url, init);
  }

  private checkResponse(body: string) {
    if (
      body.includes(
        'To continue with your YouTube experience, please fill out the form below.'
      ) ||
      body.includes('https://www.google.com/sorry/index')
    ) {
      throw new Error("Banned from Google's network.");
    }
  }

  private scrapeVideoPage(body: string): PlayerResponse {
    const regex = new RegExp(
      /window\["ytInitialPlayerResponse"\]\s*=\s*(.*?);\n/
    );
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Video unavailable.');
    }

    const playerResponse = JSON.parse(match[1]) as PlayerResponse;

    if (playerResponse.playabilityStatus?.status !== 'OK') {
      const reason =
        playerResponse.playabilityStatus.errorScreen?.playerErrorMessageRenderer
          ?.subreason?.simpleText ||
        playerResponse.playabilityStatus.errorScreen?.playerErrorMessageRenderer
          ?.reason?.simpleText ||
        playerResponse.playabilityStatus.reason;
      if (reason) {
        throw new Error(reason);
      }

      throw new Error('Video unavailable.');
    }

    if (!playerResponse.videoDetails?.title) {
      throw new Error('Video unavailable.');
    }

    return playerResponse;
  }
}
