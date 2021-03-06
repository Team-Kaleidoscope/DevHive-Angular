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
}
