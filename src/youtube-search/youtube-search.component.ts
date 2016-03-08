import {Component} from 'angular2/core';
import {YouTubeSearchResult} from './youtube-search-result';
import {YouTubeSearchService} from './youtube-search.service';

@Component({
  selector: 'youtube-search',
  template: `
    <input id="query" type="text" placeholder="Search Keywords" [(ngModel)]="query" />
    <button id="search-button" (click)="performSearch()">Search</button>
    <div id="search-nav">
      <a id="search-prev" *ngIf="prevPageToken" (click)="performSearch(prevPageToken)">Previous</a>
      <a id="search-next" class="right" *ngIf="nextPageToken" (click)="performSearch(nextPageToken)">Next</a>
    </div>
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
  prevPageToken:string = '';
  nextPageToken:string = '';
  pageToken:string = '';

  //a constructor to instantiate a new YouTubeSearchService
  constructor(private _searchService:YouTubeSearchService) { }  

  //a function to be called when the YouTube API has been successfully loaded
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  performSearch(pageToken:string) {
    this.searchResults = [];
    console.log("Query: " + this.query);

    this.pageToken = pageToken;

    //Perform the search using the search service, which returns a Promise
    //then.. set this object's searchResults to the value returned by Promise.resolve
    this._searchService.search(this).then(searchResults => this.searchResults = searchResults);
  }

  //a function to track the selected video
  onSelect(result: YouTubeSearchResult) { this.selectedVideo = result; }
}
