//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
//My stuff
import { Constants } from '../constants';
import { YouTubeVideo, 
         YouTubeVideoListParameters } from '../common/interfaces';
import { YouTubeSearchService } from '../youtube-search/youtube-search.service';

@Component({
  selector: 'favorites',
  templateUrl: 'src/favorites/favorites.component.html',
  styleUrls: ['src/favorites/favorites.component.css']
})
export class FavoritesComponent {

  private videos:YouTubeVideo[];                //array to hold page of search results
  private selectedVideo:YouTubeVideo;           //pointer to selected video
  private prevPageToken:string = '';            //token for previous page of search results (if applicable)
  private nextPageToken:string = '';            //token for next page of search results (if applicable)
  private pageToken:string = '';                //current page token
  private errorMessage:string = '';             //error message to be displayed
  private working = false;                      //boolean to determine when to display
  
  private faves:string[];
  
  //a constructor to provide inject instances of YouTubeSearchService and Router
  constructor(private _searchService:YouTubeSearchService, 
              private _router:Router) { }

  _displayError(message: string) { 
    this.errorMessage = message; 
  }
              
  ngOnInit() {
    this.faves = window.localStorage.getItem('faves') ? JSON.parse(window.localStorage.getItem('faves')) : [];
    
    if (Constants.DEBUG) console.log(this.faves);
    
    if (this.faves.length !==0) {
      //retrieve first page
      this.retrieve('');
      //.then(firstpage => this.videos = firstpage);
    }
  }
  
  retrieve(pageToken:string) {
    this.working = true; //set status to working
    this.videos = []; //clear videos array
    this.errorMessage = ''; //clear any error messages
    
    //Define search parameters
    var params:YouTubeVideoListParameters = { 
      part: 'snippet',
      id: this.faves.join(','),
      maxResults: Constants.VIDEO_LIST_MAX_RESULTS
    };
    //additional parameters
    if (pageToken) { params['pageToken'] = pageToken; }
    
    //Perform the search using the search service, which returns a Promise of the response
    //then.. process the results to populate this.videos[]
    this._searchService.getVideoInfo(params) //pass this as a parameter so the service can access its variables
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
            videoId : result.id,
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

          if (Constants.DEBUG) console.log(r);

          //...and push it to this.videos (through local results variable)
          videos.push(r);
        });
        
      })
      .then(() => { 
        this.pageToken = pageToken; //update the page token to the provided value
        this.working = false; //set the 'working' flag to false after the results have arrived
      }); 
  }
  
  /* Handle what happens when a user clicks on a search result */
  onSelect(result: YouTubeVideo) { 
    this.selectedVideo = result;
    this._router.navigate(['Detail', { videoId: this.selectedVideo.videoId }]);
  }
  
  /* What happens when the "Clear Favorites" link is pressed? */
  clear() {
    if (confirm('Are you sure you want to clear your favorites?')) {
      window.localStorage.removeItem('faves');
      this.faves = [];
      alert('Favorites cleared');
    }
  }
}
