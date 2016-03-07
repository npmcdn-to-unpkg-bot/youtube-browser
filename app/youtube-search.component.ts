import {Component} from 'angular2/core';
import {YouTubeVideo} from './youtubevideo';

declare var gapi : any;

@Component({
  selector: 'youtube-search',
  template: `
    <input id="query" type="text" placeholder="Keywords" [(ngModel)]="query" />
    <button id="search-button" (click)="search()">Search</button>
  `
})

export class YouTubeSearchComponent {
  public videos = [];
  selectedVideo: YouTubeVideo;
  public query: string;
  
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  search() {
    console.log("Query: " + this.query);
    
    var request = gapi.client.youtube.search.list({
      q: this.query,
      part: 'snippet'
    });

    request.execute(function(response) {
      console.log(response);
      //if (response.items) this.videos = response.items;
    });
  }
  
  onSelect(video: YouTubeVideo) { this.selectedVideo = video; }

}