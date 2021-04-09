import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants.module';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  constructor(private _http: HttpClient, private _tokenService: TokenService)
  { }

  postFriendWithSessionStorageRequest(friendUsername: string): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.postFriendRequest(userId, token, friendUsername);
  }

  deleteFriendWithSessionStorageRequest(friendUsername: string): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.deleteFriendRequest(userId, token, friendUsername);
  }

  postFriendRequest(userId: Guid, authToken: string, friendUsername: string): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()).set('FriendUsername', friendUsername),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };
    return this._http.post(AppConstants.API_FRIENDS_URL, {}, options);
  }

  deleteFriendRequest(userId: Guid, authToken: string, friendUsername: string): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()).set('FriendUsername', friendUsername),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };
    return this._http.delete(AppConstants.API_FRIENDS_URL, options);
  }
}
