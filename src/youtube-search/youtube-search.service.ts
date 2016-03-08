import {YouTubeSearchResult} from './youtube-search-result';
//import {RESULTS} from './mock-results';
import {Injectable} from 'angular2/core';

declare var gapi : any;

@Injectable()

export class YouTubeSearchService {
  results:YouTubeSearchResult[] = [];

  search(query:string) {

    var request = gapi.client.youtube.search.list({
      q: query,
      part: 'snippet'
    });

    console.log(request);

    //return new Promise<YouTubeSearchResult[]>(resolve => setTimeout(()=>resolve(RESULTS), 2000));

    return new Promise<YouTubeSearchResult[]>(resolve => {
      console.log('Executing request');

      var results = this.results;

      request.execute(function(response) {
        console.log(response);

        response.items.forEach(function(result, index, array) {
          console.log(result);

          var r:YouTubeSearchResult = {
            etag : result.etag,
            videoId : result.id.videoId,
            channelId : result.snippet.channelId,
            channelTitle : result.snippet.channelTitle, 
            title : result.snippet.title,
            description : result.snippet.description,
            timestamp : result.snippet.publishedAt,
            thumbnails : {
              high : { 
                height:(result.snippet.thumbnails.high.height), 
                width:(result.snippet.thumbnails.high.width), 
                url:(result.snippet.thumbnails.high.url) 
              },
              medium : { 
                height:(result.snippet.thumbnails.medium.height), 
                width:(result.snippet.thumbnails.medium.width), 
                url:(result.snippet.thumbnails.medium.url) 
              }
            }
          };

          console.log(r);
          results.push(r);
        });

        resolve(results);
      });
    });
  }
}
