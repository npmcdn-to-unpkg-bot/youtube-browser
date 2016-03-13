//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
//My stuff
import { Constants } from '../constants';
import { YouTubeVideo, 
         YouTubeVideoListParameters,
         YouTubeCommentThreadListParameters } from '../common/interfaces';
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';
import { MyTimestampPipe } from '../custom-pipes/my-timestamp.pipe';

@Component({
  selector: 'youtube-detail',
  templateUrl: 'src/youtube-detail/youtube-detail.component.html',
  styleUrls: ['src/youtube-detail/youtube-detail.component.css'],
  inputs: ['selectedVideo'],
  pipes: [MyTimestampPipe]
})
export class YouTubeDetailComponent implements OnInit {

  private detailView: string = 'vidInfo';   //default view
  
  private videoId: string;                  //selected video's videoId
  
  private vidInfo: any;                     //object to hold data returned from API's video.list()
  private vidStats: any;                    //object to hold data returned from API's video.list()
  private comments: any[];                  //array to hold comments returned from API's commentThread.list()
  
  private nextPageToken:string = '';        //token for next page of comments (if applicable)
  private isFavorite: boolean = false;      //boolean to hold 
  private errorMessage: string = '';
  
  private info_working = false;             //boolean to indicate when we're waiting on info results
  private stats_working = false;            //boolean to indicate when we're waiting on statistics results
  private comments_working = false;         //boolean to indicate when we're waiting on comment results
  
  /* A constructor to provide access to YouTubeSearchService and Angular 2 Router */
  constructor(private _searchService: YouTubeSearchService,
              private _router: Router,
              private _routeParams: RouteParams) { 
              
    this.videoId = this._routeParams.get('videoId');
  }
              
  /* A function to handle error messages */
  _displayError(message:string):void { 
    console.log(message);
    this.errorMessage = message; 
  }
  
  /* Run on initialization of component */
  ngOnInit() {
    //get basic info
    this.loadBasicInfo();
    
    //get statistics
    this.loadStats();
    
    //load the first page of comments
    this.loadComments('');
    
    //get favorites and determine if this video is in the favorites
    var faves = window.localStorage.getItem('faves') ? JSON.parse(window.localStorage.getItem('faves')) : [];
    this.isFavorite = (faves.find(id => id === this.videoId));
  }
  
  /* Perform request to retrieve video information, and update this.vidInfo upon receiving a response */
  loadBasicInfo() {
    this.info_working = true; //set status to working
    this.errorMessage = ''; //clear any error messages
    
    //build request parameters
    var infoParams:YouTubeVideoListParameters = {
      part: 'snippet',
      id: this.videoId
    }
    
    //perform request, then process it once it has arrived
    this._searchService.getVideoInfo(infoParams)
    .then((response) => {
      this.vidInfo = response.items[0].snippet;
      if (Constants.DEBUG) console.log(this.vidInfo);
    })
    //display any error that was returned via the reject() function
    .catch((error) => { 
      this._displayError(error.message);
    })
    //..then update the "working" status to false
    .then(() => {
      this.info_working = false;
    });
  }
  
  /* Perform request to retrieve video statistics, and update this.vidStats upon receiving a response*/
  loadStats() {
    this.stats_working = true; //set status to working
    this.errorMessage = ''; //clear any error messages
    
    //build request parameters
    var statParams:YouTubeVideoListParameters = { 
      part: 'statistics',
      id: this.videoId
    };
    
    //perform request, then process it once it has arrived
    this._searchService.getVideoInfo(statParams)
    .then((response) => {
      this.vidStats = response.items[0].statistics;
      if (Constants.DEBUG) console.log(this.vidStats);
    })
    //display any error that was returned via the reject() function
    .catch((error) => { 
      this._displayError(error.message);
    })
    //..then update the "working" status to false
    .then(() => {
      this.stats_working = false;
    });
  }
  
  /* Perform request to retrieve comments, and update this.comments upon receiving a response*/
  loadComments(pageToken:string) {
    this.comments_working = true; //set status to working
    this.errorMessage = ''; //clear any error messages
    
    //build request parameters
    var params:YouTubeCommentThreadListParameters = {
      part: 'snippet',
      videoId: this.videoId,
      maxResults: Constants.COMMENT_LIST_MAX_RESULTS
    }
    
    //if a page token was specified, add it as a parameter
    if (pageToken) { params.pageToken = pageToken; }
    
    //perform request, then process it once it has arrived
    this._searchService.getComments(params)
    .then((response) => {
      
      this.nextPageToken = response.nextPageToken;
      
      if (this.comments) {
        Array.prototype.push.apply(this.comments, response.items);
      }
      else {
        this.comments = response.items;
      }
      
      if (Constants.DEBUG) console.log(this.comments);
    })
    //display any error that was returned via the reject() function
    .catch((error) => { 
      this._displayError(error.message);
    })
    //..then update the "working" status to false
    .then(() => {
      this.comments_working = false;
    });
  }
  
  /* What happens when the "back" link is pressed? */
  back() {
    window.history.go(-1);
  }
  
  /* Handle what happens when a user clicks on a section header */
  onSelect(viewName: string) {
    this.detailView = viewName;
  }
  
  /* Add/Removes a video as a favorite */
  toggleFavorite() {
    //retrieve the faves saved in the browser's local storage
    var faves = window.localStorage.getItem('faves') ? JSON.parse(window.localStorage.getItem('faves')) : [];
    
    //if this video was not previously favorited, add it to the local array
    if (!this.isFavorite) {
      faves.push(this.videoId);
    }
    //if the video was a favorite and it's being removed, ...
    else {
      //find the location of the video in the array
      
      //if this was an Object[] rather than a string[], we would have to use Array.find
      //var id:string = faves.find(id => id === this.videoId);
      
      //..but since it's just a string[], we can search for it more efficiently using Array.indexOf
      var i = faves.indexOf(this.videoId);
      
      if (Constants.DEBUG) console.log ('Found at location ' + i);
      
      //if the video is found in the array, remove it (if it exists)
      if (i !== -1) {
        //remove it using Array.splice()
        faves.splice(i, 1);
      }
      //otherwise, do nothing.. it's not in the array
    }
    
    //replace 'faves' variable in the browser's local storage with the local array
    window.localStorage.setItem('faves', JSON.stringify(faves));
    
    //if we make it to this point, it's safe to toggle the value of this.isFavorite
    this.isFavorite = !this.isFavorite;
  }
}
