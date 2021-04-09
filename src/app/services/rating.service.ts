import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants.module';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private _http: HttpClient, private _tokenService: TokenService)
  { }

  createRatingWithSessionStorageRequest(postId: Guid, isLike: boolean): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.createRatingRequest(userId, token, postId, isLike);
  }

  putRatingWithSessionStorageRequest(postId: Guid, isLike: boolean): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.putRatingRequest(userId, token, postId, isLike);
  }

  getRatingByUserAndPostWithSessionStorageRequest(postId: Guid): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.getRatingByUserAndPostRequest(userId, token, postId);
  }

  deleteRatingFromSessionStorageRequest(ratingId: Guid): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.deleteRatingRequest(userId, token, ratingId);
  }

  createRatingRequest(userId: Guid, authToken: string, postId: Guid, isLike: boolean): Observable<object>  {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };
    const body = {
      postId: postId.toString(),
      isLike: isLike
    };

    return this._http.post(AppConstants.API_RATING_URL, body, options);
  }

  putRatingRequest(userId: Guid, authToken: string, postId: Guid, isLike: boolean): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()).set('PostId', postId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };
    const body = {
      isLike: isLike
    };

    return this._http.put(AppConstants.API_RATING_URL, body, options);
  }

  getRatingByUserAndPostRequest(userId: Guid, authToken: string, postId: Guid): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()).set('PostId', postId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };

    return this._http.get(AppConstants.API_RATING_URL + '/GetByUserAndPost', options);
  }

  deleteRatingRequest(userId: Guid, authToken: string, ratingId: Guid): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()).set('RatingId', ratingId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };

    return this._http.delete(AppConstants.API_RATING_URL, options);
  }
}
