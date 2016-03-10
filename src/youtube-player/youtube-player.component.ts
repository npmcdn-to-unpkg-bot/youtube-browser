//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { YouTubeSearchResult } from '../youtube-search/youtube-search-result';
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';

@Component({
  selector: 'youtube-player',
  templateUrl: 'src/youtube-player/youtube-player.component.html',
  styleUrls: ['src/youtube-player/youtube-player.component.css'],
  inputs: ['selectedVideo']
})
export class YouTubePlayerComponent implements OnInit {

  selectedVideo:YouTubeSearchResult;
  
  constructor(
    private _searchService: YouTubeSearchService,
    private _routeParams: RouteParams) {
  }
  
  ngOnInit() {
    let videoId = this._routeParams.get('videoId');
    this._searchService.getVideo(videoId).then(selectedVideo => this.selectedVideo = selectedVideo);
  }
  
  back() {
    window.history.go(-1);
  }
}
