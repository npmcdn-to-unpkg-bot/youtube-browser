//Angular stuff
import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
//My stuff
import { YouTubeSearchResult } from '../youtube-search/youtube-search-result';

@Component({
  selector: 'favorites',
  templateUrl: 'src/favorites/favorites.component.html',
  styleUrls: ['src/favorites/favorites.component.css']
})
export class FavoritesComponent {

  errorMessage:string;
  faves:YouTubeSearchResult[];
  selectedVideo:YouTubeSearchResult;    //pointer to selected video
  
  constructor(private _router:Router) { }
              
  ngOnInit() {
    this.faves = localStorage.getItem('faves') ? JSON.parse(localStorage.getItem('faves')) : [];
    
    console.log(this.faves);
    console.log(localStorage.getItem('faves'));
  }
  
  //a function to track the selected video
  onSelect(result: YouTubeSearchResult) { 
    this.selectedVideo = result;
    this.openPlayer();
  }
  openPlayer() {
    this._router.navigate(['Player', { videoId: this.selectedVideo.videoId }]);
  }
  
  clear() {
    if (confirm('Are you sure you want to clear your favorites?')) {
      localStorage.removeItem('faves');
      this.faves = [];
      alert('Favorites cleared');
    }
  }
}
