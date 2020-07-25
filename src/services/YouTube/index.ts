import fetch, { RequestInit, Response } from 'node-fetch';

import {
  Content,
  ContentType,
  ContentStream,
  ContentStatistics,
  ContentStreamType,
} from '../../types/Content';
import { Thumbnail } from '../../types/Thumbnail';
import { Service } from '../../types/Service';
import { Playlist } from '../../types/Playlist';
import { formats } from './formats';
import { SearchResults } from '../../types/SearchResults';

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
  signatureCipher?: string;
  cipher?: string;
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
      thumbnails?: Thumbnail[];
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
  microformat?: {
    playerMicroformatRenderer?: {
      description?: {
        simpleText?: string;
      };
      publishDate?: string;
    };
  };
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
  currentVideoEndpoint?: any;
  trackingParams?: string;
  playerOverlays?: any;
  engagementPanels?: any[];
  topbar?: any;
  webWatchNextResponseExtensionData?: any;
}

interface LongBylineText {
  runs: {
    text: string;
    navigationEndpoint: {
      browseEndpoint: {
        browseId: string;
        canonicalBaseUrl: string;
      };
    };
  }[];
}

interface CompactVideoRenderer {
  videoId: string;
  thumbnail: {
    thumbnails: Thumbnail[];
  };
  title: {
    simpleText: string;
  };
  longBylineText: LongBylineText;
  viewCountText: {
    runs: { text: string }[];
  };
  badges?: {
    metadataBadgeRenderer: {
      style: string;
      label: string;
    };
  }[];
}

interface VideoInitialData extends InitialData {
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
                      thumbnails?: Thumbnail[];
                    };
                  };
                };
              };
            }
          ];
        };
      };
      secondaryResults?: {
        secondaryResults: {
          results: {
            compactAutoplayRenderer?: {
              contents: [
                {
                  compactVideoRenderer?: CompactVideoRenderer;
                }
              ];
            };
            compactRadioRenderer?: {};
            compactVideoRenderer?: CompactVideoRenderer;
          }[];
        };
      };
    };
  };
}

interface PlaylistInitialData extends InitialData {
  contents?: {
    twoColumnBrowseResultsRenderer?: {
      tabs?: [
        {
          tabRenderer: {
            selected: boolean;
            content: {
              sectionListRenderer?: {
                contents?: [
                  {
                    itemSectionRenderer?: {
                      contents?: [
                        {
                          playlistVideoListRenderer?: {
                            contents?: [
                              {
                                playlistVideoRenderer: {
                                  videoId: string;
                                  thumbnail: {
                                    thumbnails: Thumbnail[];
                                  };
                                  title: {
                                    simpleText: string;
                                  };
                                  index: {
                                    simpleText: string;
                                  };
                                  shortBylineText: {
                                    runs: {
                                      text: string;
                                      navigationEndpoint: {
                                        browseEndpoint: {
                                          browseId: string;
                                          canonicalBaseUrl: string;
                                        };
                                      };
                                    }[];
                                  };
                                  navigationEndpoint: {
                                    watchEndpoint: {
                                      videoId: string;
                                      playlistId: string;
                                      index: number;
                                      startTimeSeconds: number;
                                    };
                                  };
                                  lengthSeconds: string;
                                  isPlayable: boolean;
                                  isWatched: boolean;
                                };
                              }
                            ];
                          };
                        }
                      ];
                    };
                  }
                ];
              };
            };
          };
        }
      ];
    };
  };
  microformat?: {
    microformatDataRenderer?: {
      urlCanonical?: 'http://www.youtube.com/playlist?list=PL5BF9E09ECEC8F88F';
      title?: '4k Resolution';
      description?: '';
      thumbnail?: {
        thumbnails?: Thumbnail[];
      };
    };
  };
  sidebar?: {
    playlistSidebarRenderer?: {
      items?: [
        {
          playlistSidebarPrimaryInfoRenderer?: {};
        },
        {
          playlistSidebarSecondaryInfoRenderer?: {
            videoOwner?: {
              videoOwnerRenderer?: {
                thumbnail?: {
                  thumbnails?: Thumbnail[];
                };
                title?: {
                  runs: {
                    text: string;
                    navigationEndpoint: {
                      browseEndpoint: {
                        browseId: string;
                      };
                    };
                  }[];
                };
              };
            };
          };
        }
      ];
    };
  };
}

interface SearchInitialData {
  contents?: {
    twoColumnSearchResultsRenderer: {
      primaryContents: {
        sectionListRenderer: {
          contents: [
            {
              itemSectionRenderer: {
                contents: {
                  videoRenderer: {
                    videoId: string;
                    title?: {
                      runs?: {
                        text?: string;
                      }[];
                    };
                    longBylineText?: LongBylineText;
                    thumbnail?: { thumbnails: Thumbnail[] };
                  };
                }[];
              };
            }
          ];
        };
      };
    };
  };
}

enum Operations {
  REVERSE,
  SLICE,
  SPLICE,
  SWAP,
}

export class YouTube implements Service {
  async content(id: string): Promise<Content> {
    const res = await this.fetch(
      `watch?v=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const playerResponse = this.scrapePlayerResponse(body);
    const initialData = this.scrapeInitialData(body) as VideoInitialData;

    const { videoDetails, streamingData, microformat } = playerResponse;
    const microformatRenderer = microformat?.playerMicroformatRenderer;

    if (videoDetails.videoId !== id) {
      throw new Error("Video ID doesn't match.");
    }

    const baseJsUrl = this.scrapeBaseJsUrl(body);
    const baseJsRes = await this.fetch(baseJsUrl);
    const baseJsBody = await baseJsRes.text();
    const decipher = this.scrapeCipherOperations(baseJsBody);

    const streams: ContentStream[] = [];
    if (streamingData?.adaptiveFormats) {
      for (let format of streamingData?.adaptiveFormats) {
        const itag = format.itag.toString();
        const fmt = itag in formats ? formats[itag] : undefined;
        let url = format.url;
        if (format.signatureCipher || format.cipher) {
          url = this.decipherUrl(
            (format.signatureCipher || format.cipher) as string,
            decipher
          );
        }

        streams.push({
          url,
          type: format.fps ? ContentStreamType.VIDEO : ContentStreamType.VIDEO,
          bitrate: format.bitrate,
          fps: format.fps,
          label: format.qualityLabel,
          height: fmt?.height,
          width: fmt?.width,
        });
      }
    }

    const primaryInfo =
      initialData.contents?.twoColumnWatchNextResults?.results?.results
        ?.contents?.[0].videoPrimaryInfoRenderer;
    const sentimentBarTooltip =
      primaryInfo?.sentimentBar?.sentimentBarRenderer?.tooltip;
    const viewCount = videoDetails.viewCount;

    let statistics: ContentStatistics | undefined = undefined;
    if (viewCount) {
      statistics = {
        plays: parseInt(viewCount),
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

    let related: Content[] | undefined = undefined;
    if (
      initialData.contents?.twoColumnWatchNextResults?.secondaryResults
        ?.secondaryResults.results[0]
    ) {
      related = [];
      const secondaryResults =
        initialData.contents?.twoColumnWatchNextResults?.secondaryResults
          ?.secondaryResults.results[0];
      if (
        secondaryResults.compactAutoplayRenderer?.contents[0]
          ?.compactVideoRenderer
      ) {
        const renderer =
          secondaryResults.compactAutoplayRenderer?.contents[0]
            ?.compactVideoRenderer;
        related.push({
          id: renderer.videoId,
          title: renderer.title.simpleText,
          type: renderer.badges ? ContentType.LIVE_STREAM : ContentType.VIDEO,
          author: {
            id:
              renderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint
                .browseId,
            name: renderer.longBylineText.runs[0].text,
          },
        });
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
      description:
        microformatRenderer?.description?.simpleText ||
        videoDetails.shortDescription,
      date: microformatRenderer?.publishDate
        ? new Date(microformatRenderer?.publishDate)
        : undefined,
      related,
    };
  }

  async playlist(id: string): Promise<Playlist> {
    const res = await this.fetch(
      `playlist?list=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const initialData = this.scrapeInitialData(body) as PlaylistInitialData;
    const microformatRenderer =
      initialData.microformat?.microformatDataRenderer;
    const videoOwnerRenderer =
      initialData.sidebar?.playlistSidebarRenderer?.items?.[1]
        ?.playlistSidebarSecondaryInfoRenderer?.videoOwner?.videoOwnerRenderer;
    const playlistContents =
      initialData.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]
        ?.tabRenderer.content.sectionListRenderer?.contents?.[0]
        .itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer
        ?.contents;

    if (!microformatRenderer?.title || !videoOwnerRenderer?.title?.runs?.[0]) {
      throw new Error('Playlist not available.');
    }

    const titleRun = videoOwnerRenderer.title.runs[0];

    return {
      id: id,
      title: microformatRenderer?.title,
      thumbnails: microformatRenderer?.thumbnail?.thumbnails,
      author: {
        id: titleRun.navigationEndpoint.browseEndpoint.browseId,
        name: titleRun.text,
        thumbnails: videoOwnerRenderer.thumbnail?.thumbnails,
      },
      contents: playlistContents?.map(content => ({
        id: content.playlistVideoRenderer.videoId,
        title: content.playlistVideoRenderer.title.simpleText,
        type: ContentType.VIDEO,
        author: {
          id:
            content.playlistVideoRenderer.shortBylineText.runs[0]
              .navigationEndpoint.browseEndpoint.browseId,
          name: content.playlistVideoRenderer.shortBylineText.runs[0].text,
        },
        thumbnails: content.playlistVideoRenderer.thumbnail.thumbnails,
        duration: parseInt(content.playlistVideoRenderer.lengthSeconds),
      })),
    };
  }

  async search(id: string): Promise<SearchResults> {
    const res = await this.fetch(
      `results?search_query=${encodeURIComponent(
        id
      )}&sp=EgIQAQ%253D%253D&gl=US&hl=en&has_verified=1&bpctr=9999999999`
    );

    const body = await res.text();

    this.checkResponse(body);
    const initialData = this.scrapeInitialData(body) as SearchInitialData;
    const searchContents =
      initialData.contents?.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    if (!searchContents) {
      throw new Error('Search results not available.');
    }

    return {
      contents: searchContents?.map(content => ({
        id: content.videoRenderer.videoId,
        title: content.videoRenderer.title?.runs?.[0]?.text || '',
        type: ContentType.VIDEO,
        thumbnails: content.videoRenderer.thumbnail?.thumbnails,
        author: content.videoRenderer.longBylineText?.runs[0]
          ? {
              id:
                content.videoRenderer.longBylineText?.runs[0].navigationEndpoint
                  .browseEndpoint.browseId,
              name: content.videoRenderer.longBylineText?.runs[0].text,
            }
          : undefined,
      })),
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
    const regex = /ytplayer.config\s*=\s*(.*?)};/;
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
    const regex = /window\["ytInitialData"\]\s*=\s*(.*?);\n/;
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Website unavailable.');
    }

    const initialData = JSON.parse(match[1]) as InitialData;

    if (!initialData) {
      throw new Error('Website unavailable.');
    }

    return initialData;
  }

  private decipherUrl(signature: string, decipher: (text: string) => string) {
    const params = new URLSearchParams(signature);
    const arg = params.get('sp');
    const sig = params.get('s');
    const url = params.get('url');

    if (!arg || !sig || !url) {
      throw new Error('Invalid parameters.');
    }

    return url + '&' + arg + '=' + decipher(sig);
  }

  private scrapeBaseJsUrl(body: string): string {
    const regex = /src="(.*?)"\stype="text\/javascript" name="player_ias\/base"/;
    const match = regex.exec(body);
    if (!match?.[1]) {
      throw new Error('Player unavailable.');
    }

    return match[1];
  }

  private scrapeCipherOperations(baseJsBody: string): (text: string) => string {
    const objectRegex = /var (\w{1,4})={(((\w+):function\(a.*?(a\.reverse|a\.slice|a\.splice|var c=a.*?a\.length)+.*?}(,\n)?))+};/;
    const objectMatch = objectRegex.exec(baseJsBody)!;
    const functionRegex = /(\w{1,4})=function\(a\){a=a\.split\(""\);()(.*?)return a\.join\(""\)};/;
    const functionMatch = functionRegex.exec(baseJsBody);

    if (!objectMatch?.[0] || !functionMatch?.[0]) {
      throw new Error('Player unavailable.');
    }

    const objectName = objectMatch[1];
    const objectBody = objectMatch[0];
    const functionBody = functionMatch[3];

    const operations: Record<string, Operations> = {};
    const objectLines = objectBody
      .replace('var ' + objectName + '={', '')
      .split('\n');
    for (const line of objectLines) {
      const name = line.split(':')[0];
      if (line.includes('a.reverse')) {
        operations[name] = Operations.REVERSE;
      } else if (line.includes('a.slice')) {
        operations[name] = Operations.SLICE;
      } else if (line.includes('a.splice')) {
        operations[name] = Operations.SPLICE;
      } else {
        operations[name] = Operations.SWAP;
      }
    }

    const textFunctions: ((chars: string[]) => string[])[] = [];
    const calls = functionBody.split(';');
    for (const call of calls) {
      if (call.length > 0 && call.startsWith(objectName + '.')) {
        const operationName = call.replace(objectName + '.', '').split('(')[0];
        const commaSplit = call.split(',');
        let operationArgument: string = '0';
        if (commaSplit.length > 1) {
          operationArgument = commaSplit[1].split(')')[0];
        }

        const argument = parseInt(operationArgument);

        if (operations[operationName]) {
          switch (operations[operationName]) {
            case Operations.REVERSE:
              textFunctions.push(chars => chars.reverse());
              break;
            case Operations.SLICE:
              textFunctions.push(chars => chars.slice(argument));
              break;
            case Operations.SPLICE:
              textFunctions.push(chars => chars.splice(0, argument));
              break;
            case Operations.SWAP:
              textFunctions.push(chars => {
                const first = chars[0];
                chars[0] = chars[argument % chars.length];
                chars[argument] = first;
                return chars;
              });
              break;
          }
        }
      }
    }

    return text => {
      let chars = text.split('');
      for (const fn of textFunctions) {
        chars = fn(chars);
      }
      return chars.join('');
    };
  }
}
