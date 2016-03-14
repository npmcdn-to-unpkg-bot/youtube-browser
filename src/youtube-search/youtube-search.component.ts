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

  private videos:YouTubeVideo[];         //array to hold page of search results
  private selectedVideo:YouTubeVideo;    //pointer to selected video
  private prevPageToken:string = '';     //token for previous page of search results (if applicable)
  private nextPageToken:string = '';     //token for next page of search results (if applicable)
  private pageToken:string = '';         //current page token
  private errorMessage:string = '';      //error message to be displayed
  private working:boolean = false;       //boolean to determine when to display
  
  /* user input */
  private query:string = '';             //user-provided query
  private geolocation:string = '';       //user-provided location
  private radius:string = '';            //user-provided location search radius
  private orderBy:string = 'relevance';  //default sort order - relevance, per YouTube API documentation
  
  /* A constructor to provide access to YouTubeSearchService and Angular 2 Router */
  constructor(private _searchService:YouTubeSearchService, 
              private _router:Router) { }

  /* A function to handle error messages */
  _displayError(message:string):void { 
    console.log(message);
    this.errorMessage = message; 
  }
  
  /* Perform a search request */
  performSearch(pageToken:string) {
    //test user input for validity
    if (!this.isValid()) {
      this._displayError('Invalid input');
      return;
    }
    
    this.working = true; //set status to working
    this.videos = []; //clear videos array
    this.errorMessage = ''; //clear any error messages
    
    if (Constants.DEBUG) console.log("Query: " + this.query);

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
        
        this.nextPageToken = response.nextPageToken;
        this.prevPageToken = response.prevPageToken;

        //necessary for Array.forEach function to be able to access this.videos
        var videos = this.videos;

        //for each item received..
        response.items.forEach(function(result, index, array) {
          //if (Constants.DEBUG) console.log(result);

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
            //  high : { 
            ///    height:(result.snippet.thumbnails.high.height), 
            //    width:(result.snippet.thumbnails.high.width), 
            //    url:(result.snippet.thumbnails.high.url) 
            //  },
              medium : { 
            //    height:(result.snippet.thumbnails.medium.height), 
            //    width:(result.snippet.thumbnails.medium.width), 
                url:(result.snippet.thumbnails.medium.url) 
              }
            }
          };

          if (Constants.DEBUG) console.log(r);

          //...and push it to this.videos (through local results variable)
          videos.push(r);
        });
        
      })
      //display any error that was returned via the reject() function
      .catch((error) => { 
        this._displayError(error.message);
      })
      .then(() => { 
        this.pageToken = pageToken; //update the page token to the provided value
        this.working = false; //set the 'working' flag to false after the results have arrived
      }); 
  }
  
  /* Handle what happens when a user clicks on a search result */
  onSelect(result: YouTubeVideo) { 
    this.selectedVideo = result;
    
    //show the details for the selected video
    this._router.navigate(['Detail', { videoId: this.selectedVideo.videoId }]);
  }

  
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { 
        this.geolocation = parseFloat(position.coords.latitude.toFixed(5)) + ',' + 
                           parseFloat(position.coords.longitude.toFixed(5));
                           
        if (Constants.DEBUG) console.log("Using current location (" + this.geolocation + ")");
      });
    }
  }

  
  /** Validation functions **/
  
  /* Validate the latitude/longitude input against regular expression that matches
   * latitude between -90.0 and 90.0, and longitude between -180.0 and 180.0*/
  isValidLocation() { 
    //                           (optional)           (optional)        (optional)|                                    (optional)          (optional)
    //                               -            1-6 decimal places       .0+  |                                    1-6 decimal places      .0+
    //                                   |  0-89  |                 | 90 |        |        |         0-179          |               | 180 | 
    return this.geolocation.match(/^-?(([1-8]?[0-9](\.{1}\d{1,6})?)|90(\.{1}0+)?),\s*-?(((([1]?[0-7])|[0-9])?[0-9](\.{1}\d{1,6})?)|180(\.{1}0+)?)?$/);
  }
  
  /* Validate the location radius only against allowed measurement units
   * the maximum radius allowed is 1000km 
   *
   * Note - this regex does not verify that the parameters are within the 
   *        allowed parameters specified in the YouTube Data API
   */
  isValidRadius() { 
    //the radius is considered valid if the location is valid and it matches the regex, or if the location is blank or invalid (in which case, the validator will fail anyway)
    return this.isValidLocation() && this.radius.match(/^\d+(m|km|ft|mi)$/); 
  }
  
  /* Determine if all of the user input is valid */
  isValid() {
    return this.geolocation === '' || (this.isValidLocation() && this.isValidRadius());
  }
}
