//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
//My stuff
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';
import { YouTubeSearchResult } from '../youtube-search/youtube-search-result';
import { MyTimestampPipe } from './my-timestamp.pipe';

@Component({
  selector: 'youtube-player',
  templateUrl: 'src/youtube-player/youtube-player.component.html',
  styleUrls: ['src/youtube-player/youtube-player.component.css'],
  inputs: ['selectedVideo'],
  pipes: [MyTimestampPipe]
})
export class YouTubePlayerComponent implements OnInit {

  videoId: string;
  vidInfo: any;
  vidStats: any;
  comments: any[];
  detailView: string = 'vidInfo';
  isFavorite: boolean = false;
  
  constructor(private _searchService: YouTubeSearchService,
              private _router: Router,
              private _routeParams: RouteParams) { }
  
  ngOnInit() {
    this.videoId = this._routeParams.get('videoId');
    
    this._searchService.getVideoInfo(this.videoId, 'statistics').then(response => this.vidStats = response);
    console.log(this.vidStats);
    
    this._searchService.getVideoInfo(this.videoId, 'snippet').then(response => this.vidInfo = response);
    console.log(this.vidInfo);
    
    this._searchService.getComments(this.videoId).then(response => this.comments = response);
    console.log(this.comments);
    
    //get favorites and determine if this video is in the favorites
    var faves = localStorage.getItem('faves') ? JSON.parse(localStorage.getItem('faves')) : [];
    this.isFavorite = (faves.find(fave => fave.videoId === this.videoId));
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
      var f:YouTubeSearchResult = {
        videoId : this.videoId,
        channelId : this.vidInfo.channelId,
        channelTitle : this.vidInfo.channelTitle, 
        title : this.vidInfo.title,
        description : this.vidInfo.description,
        timestamp : this.vidInfo.publishedAt,
        thumbnails : {
          high : { 
        //    height:(result.snippet.thumbnails.high.height), 
        //    width:(result.snippet.thumbnails.high.width), 
            url:(this.vidInfo.thumbnails.high.url) 
          },
          medium : { 
        //    height:(result.snippet.thumbnails.medium.height), 
        //    width:(result.snippet.thumbnails.medium.width), 
            url:(this.vidInfo.thumbnails.medium.url) 
          }
        }
      };
      faves.push(f);
    }
    else {
      var f:YouTubeSearchResult = faves.find(fave => fave.videoId === this.videoId);
      
      //remove video (if it exists)
      if (f) {
        var i = faves.indexOf(f);
        faves.splice(i, 1);
      }
    }
    
    //if we make it to this point, it's safe to change the value of this.isFavorite
    this.isFavorite = !this.isFavorite;
    
    //console.log(faves);
    //console.log(localStorage.getItem('faves'));
    
    localStorage.setItem('faves', JSON.stringify(faves));
    
    console.log(faves);
    console.log(localStorage.getItem('faves'));
    
  }
}
