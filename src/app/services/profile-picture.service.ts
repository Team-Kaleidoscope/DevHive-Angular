import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants.module';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  constructor(private _http: HttpClient, private _tokenService: TokenService)
  { }

  putPictureWithSessionStorageRequest(newPicture: File): Observable<object> {
    const userId = this._tokenService.getUserIdFromSessionStorageToken();
    const token = this._tokenService.getTokenFromSessionStorage();

    return this.putRatingRequest(userId, token, newPicture);
  }

  putRatingRequest(userId: Guid, authToken: string, newPicture: File): Observable<object> {
    const options = {
      params: new HttpParams().set('UserId', userId.toString()),
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
    };
    const form = new FormData();
    form.append('picture', newPicture);

    return this._http.put(AppConstants.API_PROFILE_PICTURE_URL, form, options);
  }
}
