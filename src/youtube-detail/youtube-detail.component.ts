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

  videoId: string;
  vidInfo: any;
  vidStats: any;
  comments: any[];
  nextPageToken:string = '';            //token for next page of comments (if applicable)
  detailView: string = 'vidInfo';
  isFavorite: boolean = false;
  errorMessage: string = '';
  stats_working = false;
  info_working = false;
  comments_working = false;             //boolean to determine when we're waiting on comment results
  
  constructor(private _searchService: YouTubeSearchService,
              private _router: Router,
              private _routeParams: RouteParams) { }
  
  ngOnInit() {
    this.videoId = this._routeParams.get('videoId');
    
    //get basic info
    this.loadBasicInfo();
    
    //get statistics
    this.loadStats();
    
    //load the first page of comments
    this.loadComments('');
    
    //get favorites and determine if this video is in the favorites
    var faves = localStorage.getItem('faves') ? JSON.parse(localStorage.getItem('faves')) : [];
    this.isFavorite = (faves.find(id => id === this.videoId));
  }
  
  loadBasicInfo() {
    this.info_working = true; //set status to working
    //this.comments = [];
    this.errorMessage = ''; //clear any error messages
    
    //build request parameters
    var infoParams:YouTubeVideoListParameters = {
      part: 'snippet',
      id: this.videoId
    }
    this._searchService.getVideoInfo(infoParams)
    .then((response) => {
      this.vidInfo = response.items[0].snippet;
      console.log(this.vidInfo);
    })
    .then(() => {
      this.info_working = false;
    });
  }
  
  loadStats() {
    this.stats_working = true; //set status to working
    //this.comments = [];
    this.errorMessage = ''; //clear any error messages
    
    //build request parameters
    var statParams:YouTubeVideoListParameters = { 
      part: 'statistics',
      id: this.videoId
    };
    
    this._searchService.getVideoInfo(statParams)
    .then((response) => {
      this.vidStats = response.items[0].statistics;
      console.log(this.vidStats);
    })
    .then(() => {
      this.stats_working = false;
    });
  }
  
  loadComments(pageToken:string) {
    this.comments_working = true; //set status to working
    //this.comments = [];
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
      
      console.log(this.comments);
    })
    .then(() => {
      this.comments_working = false;
    });
  }
  
  back() {
    window.history.go(-1);
  }
  
  onSelect(viewName: string) {
    this.detailView = viewName;
  }
  
  toggleFavorite() {
    var faves = localStorage.getItem('faves') ? JSON.parse(localStorage.getItem('faves')) : [];
    
    if (!this.isFavorite) {
      faves.push(this.videoId);
    }
    else {
      var id:string = faves.find(id => id === this.videoId);
      
      //remove video from array (if it exists)
      if (id) {
        var i = faves.indexOf(id);
        faves.splice(i, 1);
      }
      
      //otherwise, do nothing.. it's not in the array
    }
    
    //if we make it to this point, it's safe to change the value of this.isFavorite
    this.isFavorite = !this.isFavorite;
        
    localStorage.setItem('faves', JSON.stringify(faves));
  }
}
