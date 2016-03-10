//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
//My stuff
import { YouTubeSearchResult } from './youtube-search/youtube-search-result';
import { YouTubeSearchService } from './youtube-search/youtube-search.service';
import { YouTubeSearchComponent } from './youtube-search/youtube-search.component';
import { YouTubePlayerComponent } from './youtube-player/youtube-player.component';
import { FavoritesComponent } from './favorites/favorites.component';

//declare the gapi variable to avoid errors
declare var gapi : any;

@Component({
  selector: 'youtube-browser',
  template: `
    <h1><a href="/sandbox/youtube-browser">{{title}}</a></h1>
    <nav>
      <a [routerLink]="['Search']">Search</a>
      <a [routerLink]="['Favorites']">Favorites</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['src/app.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS, YouTubeSearchService]
})
@RouteConfig([
  { path: '/search', name: 'Search', component: YouTubeSearchComponent, useAsDefault: true },
  { path: '/player/:videoId', name: 'Player', component: YouTubePlayerComponent },
  { path: '/favorites', name: 'Favorites', component: FavoritesComponent }
])
export class App implements OnInit {
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
