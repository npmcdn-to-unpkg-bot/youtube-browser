//Angular stuff
import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
//My stuff
import { YouTubeSearchResult } from './youtube-search-result';
import { YouTubeSearchService } from './youtube-search.service';
import { YouTubePlayerComponent } from '../youtube-player/youtube-player.component';

@Component({
  selector: 'youtube-search',
  templateUrl: 'src/youtube-search/youtube-search.component.html',
  styleUrls: ['src/youtube-search/youtube-search.component.css'],
  directives: [YouTubePlayerComponent]
})
export class YouTubeSearchComponent {

  searchResults:YouTubeSearchResult[];  //array to hold page of search results
  selectedVideo:YouTubeSearchResult;    //pointer to selected video
  query:string = '';                    //user-provided query
  prevPageToken:string = '';            //token for previous page of search results (if applicable)
  nextPageToken:string = '';            //token for next page of search results (if applicable)
  pageToken:string = '';                //current page token
  geolocation:string = '';              //user-provided location
  radius:string = '';                   //user-provided location search radius
  orderBy:string = 'relevance';         //default sort order - relevance, per YouTube API documentation
  errorMessage:string = '';             //error message to be displayed
  working = false;                      //boolean to determine when to display

  //a constructor to instantiate a new YouTubeSearchService
  constructor(private _searchService:YouTubeSearchService, 
              private _router:Router) { }

  //a function to be called when the YouTube API has been successfully loaded
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  performSearch(pageToken:string) {
    
    if (!this.isValid()) {
      this._displayError('Invalid input');
      return;
    }
    
    this.working = true;
    this.searchResults = [];
    this.errorMessage = '';
    console.log("Query: " + this.query);

    this.pageToken = pageToken;

    //Perform the search using the search service, which returns a Promise of YouTubeSearchResult[]
    //then.. set this object's searchResults to the value returned by Promise.resolve
    this._searchService.search(this) //pass this as a parameter so the service can access its variables
      .then(searchResults => this.searchResults = searchResults) //set this.searchResults to the value returned from the Promise
      .then(() => this.working = false); //set the 'working' flag to false when the results have arrived
  }
  
  //a function to track the selected video
  onSelect(result: YouTubeSearchResult) { 
    this.selectedVideo = result;
    this.openPlayer();
  }
  openPlayer() {
    this._router.navigate(['Player', { videoId: this.selectedVideo.videoId }]);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { 
        this.geolocation = parseFloat(position.coords.latitude.toFixed(5)) + ',' + 
                           parseFloat(position.coords.longitude.toFixed(5));
                           
        console.log("Using current location (" + this.geolocation + ")");
      });
    }
  }

  _displayError(message: string) { 
    this.errorMessage = message; 
  }

  //Validate the latitude/longitude input against regular expression that allows latitude between -90.0 and 90.0, and longitude between -180.0 and 180.0
  isValidLocation() { 
    //                           (optional)           (optional)        (optional)|                                    (optional)          (optional)
    //                               -            1-6 decimal places       .0+  |                                    1-6 decimal places      .0+
    //                                   |  0-89  |                 | 90 |        |        |         0-179          |               | 180 |                                        
    return this.geolocation.match(/^-?(([1-8]?[0-9](\.{1}\d{1,6})?)|90(\.{1}0+)?),\s*-?(((([1]?[0-7])|[0-9])?[0-9](\.{1}\d{1,6})?)|180(\.{1}0+)?)?$/);
  }
  
  //Validate the location radius only against allowed measurement units
  //the maximum radius allowed is 1000km - this regex does not go so far to take that into account
  isValidRadius() { 
    //the radius is considered valid if the location is valid and it matches the regex, or if the location is blank or invalid (in which case, the validator will fail anyway)
    return this.isValidLocation() && this.radius.match(/^\d+(m|km|ft|mi)$/); 
  }
  isValid() {
    return this.geolocation === '' || (this.isValidLocation() && this.isValidRadius());
  }
}
