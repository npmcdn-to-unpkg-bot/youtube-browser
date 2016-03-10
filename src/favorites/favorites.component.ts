import {Component} from 'angular2/core';
import {YouTubeSearchResult} from '../youtube-search/youtube-search-result';

@Component({
  selector: 'favorites',
  templateUrl: 'src/favorites/favorites.component.html',
  styleUrls: ['src/favorites/favorites.component.css']
})
export class FavoritesComponent {

  favoriteVideos:YouTubeSearchResult[];

}
