import {YouTubeSearchResult} from './youtube-search-result';
import {Injectable} from 'angular2/core';

//declare the gapi variable to avoid TypeScript compilation errors
declare var gapi : any;

//Create a search service to query YouTube
@Injectable()
export class YouTubeSearchService {
  //local variable to hold a YouTubeSearchResult array
  results:YouTubeSearchResult[] = [];

  //Procedure to perform a YouTube Search
  //Returns: Promise<YouTubeSearchResult[]>
  search(query:string) {

    //build the search request
    var request = gapi.client.youtube.search.list({
      q: query,
      part: 'snippet'
    });

    console.log(request);

    //Return a promise of YouTubeSearchResult[] after receiving query results
    return new Promise<YouTubeSearchResult[]>(resolve => {
      console.log('Executing request');

      //necessary for request.execute function to be able to access this.results
      var results = this.results;

      //execute the request
      request.execute(function(response) {
        console.log(response);

        //for each item received..
        response.items.forEach(function(result, index, array) {
          console.log(result);

          //create a new YouTubeSearchResult
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

          //...and push it to this.results (through local results variable)
          results.push(r);
        });

        //after all of the items received have been added to the array, return it via the Promise.resolve() function
        resolve(results);
      });
    });
  }
}
