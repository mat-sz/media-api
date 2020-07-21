import fetch, { RequestInit, Response } from 'node-fetch';

import {
  Content,
  ContentType,
  ContentStream,
  ContentThumbnail,
  ContentStatistics,
  ContentStreamType,
} from '../../types/Content';
import { Service } from '../../types/Service';
import { parse } from 'path';
import { stat } from 'fs';
import { formats } from './formats';
import { Playlist } from '../../types/Playlist';

interface PlayerRange {
  start: string;
  end: string;
}

interface PlayerFormat {
  itag: number;
  url: string;
  mimeType: string;
  bitrate: number;
  initRange?: PlayerRange;
  indexRange?: PlayerRange;
  lastModified: string;
  contentLength: string;
  quality: string;
  projectionType?: string;
  averageBitrate: number;
  audioQuality?: string;
  approxDurationMs?: string;
  audioSampleRate?: string;
  audioChannels?: string;
  fps?: number;
  qualityLabel?: string;
}

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
  streamingData?: {
    expiresInSeconds?: string;
    formats?: PlayerFormat[];
    adaptiveFormats?: PlayerFormat[];
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
      thumbnails?: ContentThumbnail[];
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

interface PlayerConfig {
  args?: {
    player_response?: string;
  };
}

interface InitialData {
  responseContext?: any;
  contents?: {
    twoColumnWatchNextResults?: {
      results?: {
        results?: {
          contents?: [
            {
              videoPrimaryInfoRenderer?: {
                title?: {
                  runs?: {
                    text?: string;
                  }[];
                };
                viewCount?: {
                  videoViewCountRenderer?: {
                    viewCount?: {
                      simpleText?: string;
                    };
                    shortViewCount?: {
                      simpleText?: string;
                    };
                  };
                };
                sentimentBar?: {
                  sentimentBarRenderer?: {
                    percentIfIndifferent?: number;
                    percentIfLiked?: number;
                    percentIfDisliked?: number;
                    likeStatus?: string;
                    tooltip?: string;
                  };
                };
              };
            },
            {
              videoSecondaryInfoRenderer?: {
                owner?: {
                  videoOwnerRenderer?: {
                    thumbnail?: {
                      thumbnails?: ContentThumbnail[];
                    };
                  };
                };
              };
            }
          ];
        };
      };
    };
  };
  currentVideoEndpoint?: any;
  trackingParams?: string;
  playerOverlays?: any;
  engagementPanels?: any[];
  topbar?: any;
  webWatchNextResponseExtensionData?: any;
}

interface PlaylistInitialData extends InitialData {
  microformat?: {
    microformatDataRenderer?: {
      urlCanonical?: 'http://www.youtube.com/playlist?list=PL5BF9E09ECEC8F88F';
      title?: '4k Resolution';
      description?: '';
      thumbnail?: {
        thumbnails?: ContentThumbnail[];
      };
    };
  };
}

export class YouTube implements Service {
  async fetchContent(id: string): Promise<Content> {
    const res = await this.fetch(
      `watch?v=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const playerResponse = this.scrapePlayerResponse(body);
    const initialData = this.scrapeInitialData(body);

    const { videoDetails, streamingData } = playerResponse;

    if (videoDetails.videoId !== id) {
      throw new Error("Video ID doesn't match.");
    }

    const streams: ContentStream[] = [];
    if (streamingData?.adaptiveFormats) {
      for (let format of streamingData?.adaptiveFormats) {
        const itag = format.itag.toString();
        const fmt = itag in formats ? formats[itag] : undefined;
        streams.push({
          url: format.url,
          type: format.fps ? ContentStreamType.VIDEO : ContentStreamType.VIDEO,
          bitrate: format.bitrate,
          fps: format.fps,
          label: format.qualityLabel,
          height: formats[format.itag]?.height,
          width: formats[format.itag]?.width,
        });
      }
    }

    const primaryInfo =
      initialData.contents?.twoColumnWatchNextResults?.results?.results
        ?.contents?.[0].videoPrimaryInfoRenderer;
    const sentimentBarTooltip =
      primaryInfo?.sentimentBar?.sentimentBarRenderer?.tooltip;
    const viewCount =
      primaryInfo?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText;

    let statistics: ContentStatistics | undefined = undefined;
    if (viewCount) {
      statistics = {
        plays: parseInt(viewCount.replace(/\D/g, '')),
      };
      if (sentimentBarTooltip) {
        const split = sentimentBarTooltip
          ?.split(' / ')
          .map(str => str.replace(/\D/g, ''));
        if (split.length >= 2) {
          statistics.likes = parseInt(split[0]);
          statistics.dislikes = parseInt(split[1]);
        }
      }
    }

    return {
      type: ContentType.VIDEO,
      id: id,
      title: videoDetails.title,
      author: {
        id: videoDetails.channelId,
        name: videoDetails.author,
        thumbnails:
          initialData.contents?.twoColumnWatchNextResults?.results?.results
            ?.contents?.[1].videoSecondaryInfoRenderer?.owner
            ?.videoOwnerRenderer?.thumbnail?.thumbnails,
      },
      thumbnails: videoDetails.thumbnail?.thumbnails,
      streams,
      statistics,
      duration: parseInt(videoDetails.lengthSeconds),
      keywords: videoDetails.keywords,
      description: videoDetails.shortDescription,
    };
  }

  async fetchPlaylist(id: string): Promise<Playlist> {
    const res = await this.fetch(
      `playlist?list=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const initialData = this.scrapeInitialData(body) as PlaylistInitialData;

    if (!initialData.microformat?.microformatDataRenderer?.title) {
      throw new Error('Playlist not available.');
    }

    return {
      id: id,
      title: initialData.microformat.microformatDataRenderer?.title,
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

  private scrapePlayerResponse(body: string): PlayerResponse {
    const regex = new RegExp(/ytplayer.config\s*=\s*(.*?)};/);
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Video unavailable.');
    }

    const playerConfig = JSON.parse(match[1] + '}') as PlayerConfig;

    if (!playerConfig.args?.player_response) {
      throw new Error('Video unavailable.');
    }

    const playerResponse = JSON.parse(
      playerConfig.args?.player_response
    ) as PlayerResponse;

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

  private scrapeInitialData(body: string): InitialData {
    const regex = new RegExp(/window\["ytInitialData"\]\s*=\s*(.*?);\n/);
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Video unavailable.');
    }

    const initialData = JSON.parse(match[1]) as InitialData;

    if (!initialData) {
      throw new Error('Video unavailable.');
    }

    return initialData;
  }
}
