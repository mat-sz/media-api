import { Thumbnail } from '../../types/Thumbnail';

export interface PlayerRange {
  start: string;
  end: string;
}

export interface PlayerFormat {
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

export interface PlayerResponse {
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

export interface PlayerConfig {
  args?: {
    player_response?: string;
  };
}

export interface InitialData {
  responseContext?: any;
  currentVideoEndpoint?: any;
  trackingParams?: string;
  playerOverlays?: any;
  engagementPanels?: any[];
  topbar?: any;
  webWatchNextResponseExtensionData?: any;
}

export interface LongBylineText {
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

export interface CompactVideoRenderer {
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

export interface VideoInitialData extends InitialData {
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
            compactVideoRenderer?: CompactVideoRenderer;
          }[];
        };
      };
    };
  };
}

export interface PlaylistInitialData extends InitialData {
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
                                    runs: {
                                      text: string;
                                    }[];
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
          playlistSidebarPrimaryInfoRenderer?: any;
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

export interface SearchInitialData {
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
                    lengthText: {
                      simpleText: string;
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
