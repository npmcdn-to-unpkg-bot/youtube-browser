//Export an interface instead of a class to provide a strongly-typed Object
//in TypeScript without transpiling any JavaScript code. If any logic or 
//procedures are necessary in the future, it can be converted to a class.
export interface YouTubeSearchResult {
  etag: string,
  videoId: string,
  channelId: string,
  channelTitle: string,
  title: string,
  description: string,
  timestamp: string,
  thumbnails: { 
    high: { height: number, width: number, url: string },
    medium: { height: number, width: number, url: string }
  }
}
