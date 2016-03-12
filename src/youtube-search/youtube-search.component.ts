//Angular stuff
import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
//My stuff
import { Constants } from '../constants';
import { YouTubeVideo, 
         YouTubeSearchParameters } from '../common/interfaces';
import { YouTubeSearchService } from './youtube-search.service';
import { YouTubeDetailComponent } from '../youtube-detail/youtube-detail.component';

@Component({
  selector: 'youtube-search',
  templateUrl: 'src/youtube-search/youtube-search.component.html',
  styleUrls: ['src/youtube-search/youtube-search.component.css'],
  directives: [YouTubeDetailComponent]
})
export class YouTubeSearchComponent {

  private videos:YouTubeVideo[];                //array to hold page of search results
  private selectedVideo:YouTubeVideo;           //pointer to selected video
  private prevPageToken:string = '';            //token for previous page of search results (if applicable)
  private nextPageToken:string = '';            //token for next page of search results (if applicable)
  private pageToken:string = '';                //current page token
  private errorMessage:string = '';             //error message to be displayed
  private working = false;                      //boolean to determine when to display

  /* user input */
  query:string = '';                    //user-provided query
  geolocation:string = '';              //user-provided location
  radius:string = '';                   //user-provided location search radius
  orderBy:string = 'relevance';         //default sort order - relevance, per YouTube API documentation
  
  //a constructor to provide inject instances of YouTubeSearchService and Router
  constructor(private _searchService:YouTubeSearchService, 
              private _router:Router) { }

  _displayError(message: string) { 
    this.errorMessage = message; 
  }
  
  performSearch(pageToken:string) {
    //test user input for validity
    if (!this.isValid()) {
      this._displayError('Invalid input');
      return;
    }
    
    this.working = true; //set status to working
    this.videos = []; //clear videos array
    this.errorMessage = ''; //clear any error messages
    
    console.log("Query: " + this.query);

    //Define search parameters
    var searchParams:YouTubeSearchParameters = { 
      part: 'snippet',
      type: 'video',
      q: this.query,
      maxResults: Constants.VIDEO_LIST_MAX_RESULTS
    };
    
    //additional parameters
    if (pageToken) { searchParams['pageToken'] = pageToken; }
    if (this.orderBy != '') { searchParams['order'] = this.orderBy; }

    //verify that the location is a valid latitude/longitude tuple before setting the search parameter
    if (this.isValidLocation()) { 
      searchParams['location'] = this.geolocation;
    
      //only check/add the radius parameter if the location is specified
      if (this.radius.match(/[0-9]+(m|km|ft|mi)/)) {
        searchParams['locationRadius'] = this.radius;
      }
      else if (this.radius != '') { this._displayError('Invalid radius'); }
    }
    else if (this.geolocation != '') { this._displayError('Invalid location'); }

    
    //Perform the search using the search service, which returns a Promise of the response
    //then.. process the results to populate this.videos[]
    this._searchService.search(searchParams) //pass this as a parameter so the service can access its variables
      .then((response:any) => { //process response from Promise and populate this.videos
        
        if (response.code && response.code != 200) {
            this._displayError(response.code + ' - ' + response.message);
            return;
        }

        this.nextPageToken = response.nextPageToken;
        this.prevPageToken = response.prevPageToken;

        //necessary for Array.forEach function to be able to access this.videos
        var videos = this.videos;

        //for each item received..
        response.items.forEach(function(result, index, array) {
          //console.log(result);

          //create a new YouTubeVideo
          var r:YouTubeVideo = {
            videoId : result.id.videoId,
            etag : result.etag,
            channelId : result.snippet.channelId,
            channelTitle : result.snippet.channelTitle, 
            title : result.snippet.title,
            description : result.snippet.description,
            timestamp : result.snippet.publishedAt,
            thumbnails : {
              high : { 
                height:(result.snippet.thumbnails.high.height), 
                width:(result.snippet.thumbnails.high.width), 
                url:(result.snippet.thumbnails.high.url) 
              },
              medium : { 
                height:(result.snippet.thumbnails.medium.height), 
                width:(result.snippet.thumbnails.medium.width), 
                url:(result.snippet.thumbnails.medium.url) 
              }
            }
          };

          //console.log(r);

          //...and push it to this.videos (through local results variable)
          videos.push(r);
        });
        
      })
      .then(() => { 
        this.pageToken = pageToken; //update the page token to the provided value
        this.working = false; //set the 'working' flag to false after the results have arrived
      }); 
  }
  
  //a function to be called when the YouTube API has been successfully loaded
  static YouTubeAPILoaded() { console.log ('YouTube API loaded'); }
  
  //a function to track the selected video
  onSelect(result: YouTubeVideo) { 
    this.selectedVideo = result;
    this.openDetail();
  }
  openDetail() {
    this._router.navigate(['Detail', { videoId: this.selectedVideo.videoId }]);
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
