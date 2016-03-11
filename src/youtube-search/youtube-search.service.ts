//Angular stuff
import { Injectable } from 'angular2/core';
//My stuff
import { YouTubeSearchResult } from './youtube-search-result';
import { YouTubeSearchComponent } from './youtube-search.component';

//declare the gapi variable to avoid TypeScript compilation errors
declare var gapi : any;

//Create a search service to query YouTube
@Injectable()
export class YouTubeSearchService {
  //local variable to hold a YouTubeSearchResult array
  results:YouTubeSearchResult[] = [];

  //Procedure to perform a YouTube Search
  //Returns: Promise<YouTubeSearchResult[]>
  search(parent:YouTubeSearchComponent) {

    this.results = [];

    //Define search parameters
    var searchParams = { 
      part: 'snippet',
      type: 'video',
      q: parent.query
    };

    //additional parameters
    if (parent.pageToken) { searchParams['pageToken'] = parent.pageToken; }
    if (parent.orderBy != '') { searchParams['order'] = parent.orderBy; }

    //verify that the location is a valid latitude/longitude tuple before setting the search parameter
    if (parent.isValidLocation()) { 
      searchParams['location'] = parent.geolocation;
    
      //only check/add the radius parameter if the location is specified
      if (parent.radius.match(/[0-9]+(m|km|ft|mi)/)) {
        searchParams['locationRadius'] = parent.radius;
      }
      else if (parent.radius != '') { parent._displayError('Invalid radius'); }
    }
    else if (parent.geolocation != '') { parent._displayError('Invalid location'); }


    //build the search request
    var request = gapi.client.youtube.search.list(searchParams);

    console.log(request);

    //Execute the request and return a promise of YouTubeSearchResult[]
    return new Promise<YouTubeSearchResult[]>(resolve => {
      console.log('Executing request');

      //necessary for request.execute function to be able to access this.results
      var results = this.results;

      //execute the request
      request.execute(function(response) {
        console.log(response);

        if (response.code && response.code != 200) {
            parent._displayError(response.code + ' - ' + response.message);
            return [];
        }

        parent.nextPageToken = response.nextPageToken;
        parent.prevPageToken = response.prevPageToken;
        console.log(parent);

        //for each item received..
        response.items.forEach(function(result, index, array) {
          //console.log(result);

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

          //console.log(r);

          //...and push it to this.results (through local results variable)
          results.push(r);
        });

        //after all of the items received have been added to the array, return it via the Promise.resolve() function
        resolve(results);
        
        //delay results to simulate slow network
        //setTimeout(() => resolve(results), 2000)
      });
    });
  }
  
  //Procedure to get information about a specific video
  //Returns: Promise<YouTubeSearchResult>
  getVideo(videoId: string) {
    console.log('Retrieving video ' + videoId);
    return Promise.resolve(this.results).then(
      results => results.filter(result => result.videoId === videoId)[0]
      );
  }
  
  getVideoInfo(videoId: string, part: string) {
    
    var params = { 
      part: part,
      id: videoId
    };
    
    //build the search request
    var request = gapi.client.youtube.videos.list(params);

    console.log(request);

    //Execute the request and return a promise of the result
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //necessary for request.execute function to be able to access this.results
      var results = this.results;

      //execute the request
      request.execute(function(response) {
        switch (part) {
          case 'statistics':
            console.log(response.items[0].statistics);
            resolve(response.items[0].statistics);
            break;
          case 'snippet':
            console.log(response.items[0].snippet);
            resolve(response.items[0].snippet);
            break;
        }
      });
    });
  }
  
  getComments(videoId: string) {
    
    var params = { 
      part: 'snippet',
      videoId: videoId
    };
    
    //build the search request
    var request = gapi.client.youtube.commentThreads.list(params);

    console.log(request);

    //Return a promise of YouTubeSearchResult[] after receiving query results
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //necessary for request.execute function to be able to access this.results
      var results = this.results;

      //execute the request
      request.execute(function(response) {
        console.log(response.items);
        resolve(response.items);
      });
    });
  }
}
