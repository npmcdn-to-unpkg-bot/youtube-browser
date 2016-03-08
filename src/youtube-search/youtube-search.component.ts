import {Component} from 'angular2/core';
import {YouTubeSearchResult} from './youtube-search-result';
import {YouTubeSearchService} from './youtube-search.service';

declare var gapi : any;

@Component({
  selector: 'youtube-search',
  template: `
    <input id="query" type="text" placeholder="Search Keywords" [(ngModel)]="query" />
    <button id="search-button" (click)="performSearch()">Search</button>
    <ul>
      <li *ngFor="#result of searchResults"
        [class.selected]="result === selectedVideo"
        (click)="onSelect(result)">
        <div class="left"><img src="{{result.thumbnails.medium.url}}"></div>
        <div class="right">
          <h4>{{result.title}}</h4>
          <p>{{result.description}}</p>
        </div>
      </li>
    </ul>
  `,
  providers: [YouTubeSearchService]
})
export class YouTubeSearchComponent {

  searchResults:YouTubeSearchResult[];
  selectedVideo:YouTubeSearchResult;
  query:string = '';

  //a constructor to instantiate a new YouTubeSearchService
  constructor(private _searchService:YouTubeSearchService) { }  

  //a function to be called when the YouTube API has been successfully loaded
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  performSearch() {
    console.log("Query: " + this.query);

    //Perform the search using the search service, which returns a Promise
    //then.. set this object's searchResults to the value returned by Promise.resolve
    this._searchService.search(this.query).then(searchResults => this.searchResults = searchResults);
  }

  //a function to track the selected video
  onSelect(result: YouTubeSearchResult) { this.selectedVideo = result; }
}
