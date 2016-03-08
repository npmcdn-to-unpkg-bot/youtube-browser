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
