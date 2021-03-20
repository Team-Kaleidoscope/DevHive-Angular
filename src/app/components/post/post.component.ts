import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { PostService } from 'src/app/services/post.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/models/identity/user.model';
import { Post } from 'src/models/post.model';
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
  @Input() index: number;
  public loggedIn = false;
  private upvoteBtns: HTMLCollectionOf<HTMLElement>;
  private downvoteBtns: HTMLCollectionOf<HTMLElement>;

  constructor(private _postService: PostService, private _ratingServe: RatingService, private _userService: UserService, private _router: Router, private _tokenService: TokenService)
  { }

  ngOnInit(): void {
    this.loggedIn = this._tokenService.getTokenFromSessionStorage() !== '';

    this.post = this._postService.getDefaultPost();
    this.user = this._userService.getDefaultUser();

    this._postService.getPostRequest(Guid.parse(this.paramId)).subscribe({
      next: (result: object) => {
        Object.assign(this.post, result);

        this.post.fileURLs = Object.values(result)[7];
        this.votesNumber = this.post.currentRating;

        this.upvoteBtns = document.getElementsByClassName('upvote') as HTMLCollectionOf<HTMLElement>;
        this.downvoteBtns = document.getElementsByClassName('downvote') as HTMLCollectionOf<HTMLElement>;

        this.timeCreated = new Date(this.post.timeCreated).toLocaleString('en-GB');

        this.loadUser();
      }
    });
  }

  private loadUser(): void {
    this._userService.getUserByUsernameRequest(this.post.creatorUsername).subscribe({
      next: (result: object) => {
        Object.assign(this.user, result);

        if (this.loggedIn) {
          this.highlightButtonsOnInit();
        }

        this.loaded = true;
      }
    });
  }

  goToAuthorProfile(): void {
    this._router.navigate(['/profile/' + this.user.userName]);
  }

  goToPostPage(): void {
    this._router.navigate(['/post/' + this.post.postId]);
  }

  votePost(isLike: boolean): void {
    if (!this.loggedIn) {
      this._router.navigate(['/login']);
      return;
    }

    this._ratingServe.getRatingByUserAndPostWithSessionStorageRequest(Guid.parse(this.paramId)).subscribe(
      (x: object) => {
        if (Object.values(x)[3] === isLike) {
          this.deleteRating(Object.values(x)[0], isLike);

          this.changeColorOfVoteButton(false, false);
        }
        else {
          this.putRating(isLike);

          this.changeColorOfVoteButton(isLike, !isLike);
        }
      },
      () => {
        this.createRating(isLike);

        this.changeColorOfVoteButton(isLike, !isLike);
      }
    );
  }

  private createRating(isLike: boolean): void {
    this._ratingServe.createRatingWithSessionStorageRequest(Guid.parse(this.paramId), isLike).subscribe(
      () => {
        this.votesNumber += -1 + Number(isLike) * 2;
      }
    );
  }

  private putRating(isLike: boolean): void {
    this._ratingServe.putRatingWithSessionStorageRequest(Guid.parse(this.paramId), isLike).subscribe(
      () => {
        // when false -2 + 0 wjen true -2 + 4
        this.votesNumber += -2 + Number(isLike) * 4;
      }
    );
  }

  private deleteRating(ratingId: string, isLike: boolean): void {
    this._ratingServe.deleteRatingFromSessionStorageRequest(Guid.parse(ratingId)).subscribe(
      () => {
        this.votesNumber += 1 - Number(isLike) * 2;
      }
    );
  }

  private changeColorOfVoteButton(isUpvoted: boolean, isDownvoted: boolean): void {
    this.upvoteBtns.item(this.index)!.style.backgroundColor = (isUpvoted) ? 'var(--upvote-highlight)' : 'inherit';
    this.downvoteBtns.item(this.index)!.style.backgroundColor = (isDownvoted) ? 'var(--downvote-highlight)' : 'inherit';
  }

  private highlightButtonsOnInit(): void {
    this._ratingServe.getRatingByUserAndPostWithSessionStorageRequest(Guid.parse(this.paramId)).subscribe(
      (x: object) => {
        const isLike: boolean = Object.values(x)[3];

        this.changeColorOfVoteButton(isLike, !isLike);
      }
    );
  }
}
