import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FormData from 'form-data';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { Post } from 'src/models/post';
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

  createRatingRequest(userId: Guid, authToken: string, postId: Guid, isLike: boolean): Observable<object>  {
    const body = {
      postId: postId.toString(),
      isLike: isLike
    };
    const options = {
      params: new HttpParams().set('UserId', userId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)     
    };

    return this._http.post(AppConstants.API_RATING_URL, body, options);
  }
}
