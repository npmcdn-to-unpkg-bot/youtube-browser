//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
//My stuff
import { Constants } from './constants';
import { YouTubeVideo } from './common/interfaces';
import { YouTubeSearchService } from './youtube-search/youtube-search.service';
import { YouTubeSearchComponent } from './youtube-search/youtube-search.component';
import { YouTubeDetailComponent } from './youtube-detail/youtube-detail.component';
import { FavoritesComponent } from './favorites/favorites.component';

//declare the gapi variable to avoid TypeScript compiler errors
declare var gapi : any;

@Component({
  selector: 'youtube-browser',
  template: `
    <h1><a href="">{{title}}</a></h1>
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

//Define routes to components
@RouteConfig([
  { path: '/search', name: 'Search', component: YouTubeSearchComponent, useAsDefault: true },
  { path: '/detail/:videoId', name: 'Detail', component: YouTubeDetailComponent },
  { path: '/favorites', name: 'Favorites', component: FavoritesComponent }
])

export class App implements OnInit {
  
  public title:string = Constants.APP_TITLE;
  
  constructor() { }
  
  ngOnInit() { this.google_api_init(); }
  
  //Initialize Google API
  google_api_init():void {
    gapi.client.setApiKey(Constants.API_KEY);
    
    //load the YouTube API; when ready, execute YouTubeAPILoaded()
    gapi.client.load('youtube', 'v3', this.YouTubeAPILoaded);
  }
  
  //a function to be called when the YouTube API has been successfully loaded
  YouTubeAPILoaded():void { 
    if (Constants.DEBUG) console.log ('YouTube API loaded');
  }
}
