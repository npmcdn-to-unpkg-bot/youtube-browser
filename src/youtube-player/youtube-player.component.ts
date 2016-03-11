//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
//My stuff
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';

@Component({
  selector: 'youtube-player',
  templateUrl: 'src/youtube-player/youtube-player.component.html',
  styleUrls: ['src/youtube-player/youtube-player.component.css'],
  inputs: ['selectedVideo']
})
export class YouTubePlayerComponent implements OnInit {

  videoId: string;
  vidStats: any;
  vidInfo: any;
  comments: any[];
  detailView:string = 'vidInfo';
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
  }
  
  back() {
    window.history.go(-1);
  }
  
  onSelect(viewName: string) {
    this.detailView = viewName;
  }
  
  //Skeleton functions for saving a video as a "favorite"
  isFavorite() {
    return this.isFavorite;
  }
  toggleFavorite() {
    this.favorite = !this.favorite;
  }
}
