import {Component} from 'angular2/core';
import {YouTubeSearchComponent} from './youtube-search/youtube-search.component';

declare var gapi : any;

@Component({
  selector: 'youtube-browser',
  template: `
    <h1>{{title}}</h1>
    <youtube-search></youtube-search>
  `,
  directives: [YouTubeSearchComponent]
})

export class App {
  public title = 'YouTube Browser';
  
  //Google Browser API Key
  API_KEY = 'AIzaSyBIN5pEfYIU-IULSw121ojZ9xxf8RShFBA';

  ngOnInit() { this.google_api_init(); }
  
  //Initialize Google API
  google_api_init() {
    gapi.client.setApiKey(this.API_KEY);
    
    //load the YouTube API; when ready, execute YouTubeAPILoaded()
    gapi.client.load('youtube', 'v3', function() { YouTubeSearchComponent.YouTubeAPILoaded(); });
  }
}
