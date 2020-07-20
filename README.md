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
  const content = await youtube.fetchContent('jNQXAC9IVRw');
  console.log(content);
}
```

## Supported media websites:

- YouTube

## Usage

All classes implement the `Service` interface:

```ts
export interface Service {
  fetchContent(id: string): Promise<Content>;
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
  thumbnails?: ContentThumbnail[];
  keywords?: string[];
  author?: ContentAuthor;
}
```
