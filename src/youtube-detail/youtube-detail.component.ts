//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
//My stuff
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';
import { YouTubeVideo } from '../common/interfaces';
import { MyTimestampPipe } from '../custom-pipes/my-timestamp.pipe';
import { UnescapePipe } from '../custom-pipes/unescape.pipe';

@Component({
  selector: 'youtube-detail',
  templateUrl: 'src/youtube-detail/youtube-detail.component.html',
  styleUrls: ['src/youtube-detail/youtube-detail.component.css'],
  inputs: ['selectedVideo'],
  pipes: [MyTimestampPipe, UnescapePipe]
})
export class YouTubeDetailComponent implements OnInit {

  videoId: string;
  vidInfo: any;
  vidStats: any;
  comments: any[];
  detailView: string = 'vidInfo';
  isFavorite: boolean = false;
  errorMessage: string = '';
  
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
      var f:YouTubeVideo = {
        videoId : this.videoId,
        channelId : this.vidInfo.channelId,
        channelTitle : this.vidInfo.channelTitle,
        title : this.vidInfo.title,
        description : this.vidInfo.description,
        timestamp : this.vidInfo.publishedAt,
        thumbnails : {
          high : {
            url:(this.vidInfo.thumbnails.high.url)
          },
          medium : {
            url:(this.vidInfo.thumbnails.medium.url)
          }
        }
      };

      faves.push(f);
    }
    else {
      var f:YouTubeVideo = faves.find(fave => fave.videoId === this.videoId);
      
      //remove video from array (if it exists)
      if (f) {
        var i = faves.indexOf(f);
        faves.splice(i, 1);
      }
      
      //otherwise, do nothing.. it's not in the array
    }
    
    //if we make it to this point, it's safe to change the value of this.isFavorite
    this.isFavorite = !this.isFavorite;
        
    localStorage.setItem('faves', JSON.stringify(faves));
  }
}
