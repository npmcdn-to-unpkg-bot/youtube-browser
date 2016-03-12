//Angular stuff
import { Injectable } from 'angular2/core';
//My stuff
import { YouTubeVideo, YouTubeSearchParameters } from '../common/interfaces';
import { YouTubeSearchComponent } from './youtube-search.component';

//declare the gapi variable to avoid TypeScript compilation errors
declare var gapi : any;

//Create a search service to query YouTube
@Injectable()
export class YouTubeSearchService {

  //Procedure to perform a YouTube Search
  //Returns: Promise<YouTubeVideo[]>
  search(searchParams:YouTubeSearchParameters) {

    //build the search request
    var request = gapi.client.youtube.search.list(searchParams);

    console.log(request);

    //Execute the request and return a promise of a response object
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        console.log(response);

        //after all of the items received have been added to the array, return it via the Promise.resolve() function
        resolve(response);
        
        //delay response to simulate slow network
        //setTimeout(() => resolve(response), 2000)
      });
    });
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

    //Return a promise of YouTubeVideo[] after receiving query results
    return new Promise<any>(resolve => {
      console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        console.log(response.items);
        resolve(response.items);
      });
    });
  }
}
