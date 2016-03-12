//Angular stuff
import { Injectable } from 'angular2/core';
//My stuff
import { 
  YouTubeVideo, 
  YouTubeSearchParameters,
  YouTubeVideoListParameters,
  YouTubeCommentThreadListParameters 
} from '../common/interfaces';
import { YouTubeSearchComponent } from './youtube-search.component';

//declare the gapi variable to avoid TypeScript compilation errors
declare var gapi : any;

//Create a search service to query YouTube
@Injectable()
export class YouTubeSearchService {

  //Procedure to perform a YouTube Search
  //Returns: Promise<{search response}>
  search(params:YouTubeSearchParameters) {
    //build the request
    var request = gapi.client.youtube.search.list(params);

    console.log(request);

    //Execute the request and return a promise of a response object
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        console.log(response);

        //the response has been received, pass it to the resolve() function
        //resolve(response);
        
        //delay response to simulate slow network
        setTimeout(() => resolve(response), 2000)
      });
    });
  }
  
  getVideoInfo(params:YouTubeVideoListParameters) {
    //build the request
    var request = gapi.client.youtube.videos.list(params);

    console.log(request);

    //Execute the request and return a promise of the result
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        console.log(response);
        
        //the response has been received, pass it to the resolve() function
        //resolve(response);
        
        //delay response to simulate slow network
        setTimeout(() => resolve(response), 2000)
      });
    });
  }
  
  getComments(params:YouTubeCommentThreadListParameters) {
    //build the search request
    var request = gapi.client.youtube.commentThreads.list(params);

    console.log(request);

    //Return a promise of YouTubeVideo[] after receiving query results
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        console.log(response);
        
        //resolve(response);
        
        //delay response to simulate slow network
        setTimeout(() => resolve(response), 2000)
      });
    });
  }
}
