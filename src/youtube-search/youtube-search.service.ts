//Angular stuff
import { Injectable } from 'angular2/core';
//My stuff
import { Constants } from '../constants';
import { 
  YouTubeVideo, 
  YouTubeSearchParameters,
  YouTubeVideoListParameters,
  YouTubeCommentThreadListParameters } from '../common/interfaces';
import { YouTubeSearchComponent } from './youtube-search.component';

//declare the gapi variable to avoid TypeScript compilation errors
declare var gapi : any;

//Create a search service to query YouTube
@Injectable()
export class YouTubeSearchService {

  //Procedure to perform a YouTube search.list() request
  //Returns: Promise<{search response}>
  search(params:YouTubeSearchParameters) {
    
    if (!gapi.client.youtube) {
      return new Promise<any>((resolve, reject) => {
        reject(Error('YouTube API not loaded'));
      });
    }
    
    //build the search.list request
    var request = gapi.client.youtube.search.list(params);

    if (Constants.DEBUG) console.log(request);
    
    //execute the request and return the Promise
    return this.execute(request);
  }
  
  //Procedure to perform a YouTube videos.list() request
  //Returns: Promise<{search response}>
  getVideoInfo(params:YouTubeVideoListParameters) {
    
    if (!gapi.client.youtube) {
      return new Promise<any>((resolve, reject) => {
        reject(Error('YouTube API not loaded'));
      });
    }
    
    //build the videos.list request
    var request = gapi.client.youtube.videos.list(params);

    if (Constants.DEBUG) console.log(request);
    
    //execute the request and return the Promise
    return this.execute(request);
  }
  
  //Procedure to perform a YouTube commentThreads.list() request
  //Returns: Promise<{search response}>
  getComments(params:YouTubeCommentThreadListParameters) {
    
    if (!gapi.client.youtube) {
      return new Promise<any>((resolve, reject) => {
        reject(Error('YouTube API not loaded'));
      });
    }
    
    //build the commentThreads.list request
    var request = gapi.client.youtube.commentThreads.list(params);

    if (Constants.DEBUG) console.log(request);
    
    //execute the request and return the Promise
    return this.execute(request);
  }
  
  private execute(request:any):Promise<any> {
    //Execute the request and return a promise of a response object
    return new Promise<any>((resolve, reject) => {
      if (Constants.DEBUG) console.log('Executing request');

      //execute the request
      request.execute(function(response) {
        if (Constants.DEBUG) console.log(response);

        //check the response for an error
        if (response.code && response.code != 200) {
            //if anything other than 200 OK occurred, pass an error to the Promise's reject()
            reject(Error('API returned error ' + response.code + ' - ' + response.message));
            return;
        }
        //if the response code was 200 OK, but there is no .items object returned, return an appropriate error
        //(It just happens that all of the API requests in this application expect a .items object (Array) in the 
        //response. However, if this application is changed in the future to execute any requests for which a 
        //response.items is not expected, this will need to be moved to wherever the resolve() function is defined)
        else if (!response.items) {
          reject(Error('Unexpected response from API'));
        }
        
        //the response has been received, pass it to the resolve() function
        resolve(response);
        
        //delay response to simulate slow network
        //setTimeout(() => resolve(response), 2000)
      });
    });
  }
}
