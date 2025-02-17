<h1 align="center">media-api</h1>

<p align="center">
Unofficial API for multimedia websites. (node.js only)
</p>

<p align="center">
<img alt="workflow" src="https://img.shields.io/github/workflow/status/mat-sz/media-api/Node.js%20CI%20(yarn)">
<a href="https://npmjs.com/package/media-api">
<img alt="npm" src="https://img.shields.io/npm/v/media-api">
<img alt="npm" src="https://img.shields.io/npm/dw/media-api">
<img alt="NPM" src="https://img.shields.io/npm/l/media-api">
</a>
</p>

<p align="center">
<strong>Quickstart:</strong>
</p>

```sh
npm install media-api
# or:
yarn add media-api
```

```ts
import { YouTube } from 'media-api';

async function example() {
  const youtube = new YouTube();
  const content = await youtube.content('jNQXAC9IVRw');
  console.log(content);
}
```

## Supported media websites:

| Title                                | Content | Playlist | Search  |
| ------------------------------------ | ------- | -------- | ------- |
| [YouTube](https://youtube.com)       | ✔️      | ✔️       | Partial |
| [SoundCloud](https://soundcloud.com) | Partial | ❌       | ❌      |

## Usage

All classes implement the `Service` interface:

```ts
export interface Service {
  content(id: string): Promise<Content>;
  playlist?(id: string): Promise<Playlist>;
  search?(text: string): Promise<SearchResults>;
}
```

The `Content` interface is defined [here](https://github.com/mat-sz/media-api/blob/master/src/types/Content.ts). This is the shortened representation of it:

```ts
export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  duration?: number;
  statistics?: ContentStatistics;
  streams?: ContentStream[];
  thumbnails?: Thumbnail[];
  keywords?: string[];
  author?: Author;
  date?: Date;
}
```

The `Playlist` interface is defined [here](https://github.com/mat-sz/media-api/blob/master/src/types/Playlist.ts). This is the shortened representation of it:

```ts
export interface Playlist {
  id: string;
  title: string;
  thumbnails?: Thumbnail[];
  author?: Author;
  contents?: Content[];
}
```

The `SearchResults` interface is defined [here](https://github.com/mat-sz/media-api/blob/master/src/types/SearchResults.ts). This is the shortened representation of it:

```ts
export interface SearchResults {
  contents?: Content[];
}
```
