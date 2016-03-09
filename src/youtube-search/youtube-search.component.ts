import {Component} from 'angular2/core';
import {YouTubeSearchResult} from './youtube-search-result';
import {YouTubeSearchService} from './youtube-search.service';

@Component({
  selector: 'youtube-search',
  templateUrl: 'src/youtube-search/youtube-search.component.html',
  styleUrls: ['src/youtube-search/youtube-search.component.css'],
  providers: [YouTubeSearchService]
})
export class YouTubeSearchComponent {

  searchResults:YouTubeSearchResult[];
  selectedVideo:YouTubeSearchResult;
  query:string = '';
  prevPageToken:string = '';
  nextPageToken:string = '';
  pageToken:string = '';
  geolocation:string = '';
  radius:string = '2mi';
  orderBy:string = 'relevance'; //default sort order - relevance, per API documentation
  errorMessage:string = '';
  working = false;

  //a constructor to instantiate a new YouTubeSearchService
  constructor(private _searchService:YouTubeSearchService) { }  

  //a function to be called when the YouTube API has been successfully loaded
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  performSearch(pageToken:string) {
    this.searchResults = [];
    this.errorMessage = '';
    console.log("Query: " + this.query);

    this.pageToken = pageToken;

    this.working = true;

    //Perform the search using the search service, which returns a Promise
    //then.. set this object's searchResults to the value returned by Promise.resolve
    this._searchService.search(this).then(searchResults => this.searchResults = searchResults);

    this.working = false;
  }

  //a function to track the selected video
  onSelect(result: YouTubeSearchResult) { this.selectedVideo = result; }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { 
        this.geolocation = parseFloat(position.coords.latitude.toFixed(5)) + ',' + 
                           parseFloat(position.coords.longitude.toFixed(5));
      });
    }
  }

  _displayError(message: string) {
    this.errorMessage = message;
  }

  isValidLocation() { return this.geolocation.match(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/); }
}
