import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { PostService } from 'src/app/services/post.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/models/identity/user';
import { Post } from 'src/models/post';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  public loaded = false;
  public user: User;
  public post: Post;
  public votesNumber: number;
  public timeCreated: string;
  @Input() paramId: string;
  public loggedIn = false;

  constructor(private _postService: PostService, private _ratingServe: RatingService, private _userService: UserService, private _router: Router, private _tokenService: TokenService) { }

  ngOnInit(): void {
    this.loggedIn = this._tokenService.getTokenFromSessionStorage() !== '';

    this.post = this._postService.getDefaultPost();
    this.user = this._userService.getDefaultUser();

    this._postService.getPostRequest(Guid.parse(this.paramId)).subscribe(
      (result: object) => {
        Object.assign(this.post, result);
        this.post.fileURLs = Object.values(result)[7];
        this.votesNumber = this.post.currentRating;

        this.timeCreated = new Date(this.post.timeCreated).toLocaleString('en-GB');
        this.loadUser();
      }
    );
  }

  private loadUser(): void {
    this._userService.getUserByUsernameRequest(this.post.creatorUsername).subscribe(
      (result: object) => {
        Object.assign(this.user, result);
        this.loaded = true;
      }
    );
  }

  goToAuthorProfile(): void {
    this._router.navigate(['/profile/' + this.user.userName]);
  }

  goToPostPage(): void {
    this._router.navigate(['/post/' + this.post.postId]);
  }

  upVotePost(): void {
    if (!this.loggedIn) {
      this._router.navigate(['/login']);
      return;
    }

    this._ratingServe.getRatingByUserAndPostWithSessionStorageRequest(Guid.parse(this.paramId)).subscribe(
      (x: object) => {        
        if (Object.values(x)[3]) {
          this.deleteUpVoteRating(Object.values(x)[0]);
        }
        else {
          this.putUpVoteRating();
        }
      },
      () => {
        this.crateUpVoteRating();
      }
    );
  }
 
  crateUpVoteRating(): void {
  this._ratingServe.createRatingWithSessionStorageRequest(Guid.parse(this.paramId), true).subscribe(
    () => {
      this.votesNumber++;
    }
  );
}

  putUpVoteRating(): void {
    this._ratingServe.putRatingWithSessionStorageRequest(Guid.parse(this.paramId), true).subscribe(
      () => {
        this.votesNumber += 2;
      },
      () => {
        this.crateUpVoteRating();
      }
    );
  }

  deleteUpVoteRating(ratingId: string): void {
    this._ratingServe.deleteRatingFromSessionStorageRequest(Guid.parse(ratingId)).subscribe(
      () => {
        this.votesNumber--;
      }
    );
  }

  downVotePost(): void {
  if(!this.loggedIn) {
  this._router.navigate(['/login']);
  return;
}

this._ratingServe.putRatingWithSessionStorageRequest(Guid.parse(this.paramId), false).subscribe(
  () => {
    this.votesNumber -= 2;
  },
  () => {
    this.crateDownVoteRating();
  }
);
  }

  crateDownVoteRating(): void {
  this._ratingServe.createRatingWithSessionStorageRequest(Guid.parse(this.paramId), false).subscribe(
    () => {
      this.votesNumber--;
    }
  );
}
}
