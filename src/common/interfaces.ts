//Export an interface instead of a class to provide a strongly-typed Object
//in TypeScript without transpiling any JavaScript code. If any logic or 
//procedures are necessary in the future, it can be converted to a class.
export interface YouTubeVideo {
  videoId: string,
  etag?: string,
  channelId?: string,
  channelTitle?: string,
  title?: string,
  description?: string,
  timestamp?: string,
  thumbnails?: { 
    high?: { 
      height?: number, 
      width?: number, 
      url: string 
    },
    medium?: { 
      height?: number, 
      width?: number, 
      url: string 
    }
  }
}


export interface YouTubeSearchParameters {
  part: string,
  type?: string,
  q?: string,
  location?: string,
  locationRadius?: string,
  order?: string,
  maxResults?: number,
  pageToken?: string
}

export interface YouTubeVideoListParameters {
  part: string,
  id: string,
  maxResults?: number,
  pageToken?: string
}

export interface YouTubeCommentThreadListParameters {
  part: string,
  id?: string,
  videoId?: string,
  order?: string,
  maxResults?: number,
  pageToken?: string,
  textValue?: string
}