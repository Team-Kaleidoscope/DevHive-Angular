import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { AppConstants } from 'src/app/app-constants.module';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
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
export class PostComponent implements OnInit, AfterViewInit {
  public loaded = false;
  public user: User;
  public post: Post;
  public votesNumber: number;
  public timeCreated: string;
  @Input() paramId: string;
  @ViewChild('upvote') upvoteBtn: ElementRef;
  @ViewChild('downvote') downvoteBtn: ElementRef;
  @ViewChild('share') shareBtn: ElementRef;
  private _defaultShareBtnInnerHTML: string;
  private _linkShared = false; // For optimisation purposes
  public loggedIn = false;
  public loggedInAuthor = false;
  public editingPost = false;
  public files: File[];
  public editPostFormGroup: FormGroup;

  constructor(private _postService: PostService, private _ratingServe: RatingService, private _userService: UserService, private _router: Router, private _tokenService: TokenService, private _cloudinaryService: CloudinaryService, private _fb: FormBuilder, private _elem: ElementRef, private _renderer: Renderer2)
  { }

  ngOnInit(): void {
    this.loggedIn = this._tokenService.getTokenFromSessionStorage() !== '';

    this.post = this._postService.getDefaultPost();
    this.user = this._userService.getDefaultUser();
    this.files = [];

    this._postService.getPostRequest(Guid.parse(this.paramId)).subscribe({
      next: (result: object) => {
        Object.assign(this.post, result);

        this.post.fileURLs = Object.values(result)[7];
        this.votesNumber = this.post.currentRating;

        this.timeCreated = new Date(this.post.timeCreated).toLocaleString('en-GB');

        this.loadUser();
      }
    });

    this.editPostFormGroup = this._fb.group({
      newPostMessage: new FormControl(''),
      fileUpload: new FormControl('')
    });
  }

  private loadUser(): void {
    this._userService.getUserByUsernameRequest(this.post.creatorUsername).subscribe({
      next: (result: object) => {
        Object.assign(this.user, result);

        if (this.loggedIn) {
          this.loggedInAuthor = this._tokenService.getUsernameFromSessionStorageToken() === this.post.creatorUsername;
          this.editPostFormGroup.get('newPostMessage')?.setValue(this.post.message);

          if (this.post.fileURLs.length > 0) {
            this.loadFiles();
            return;
          }
        }

        this.loaded = true;
      }
    });
  }

  private loadFiles(): void {
    for (const fileURL of this.post.fileURLs) {
      this._cloudinaryService.getFileRequest(fileURL).subscribe({
        next: (result: object) => {
          const file = result as File;
          const tmp = {
            name: fileURL.match('(?<=\/)(?:.(?!\/))+$')?.pop() ?? 'Attachment'
          };

          Object.assign(file, tmp);
          this.files.push(file);

          if (this.files.length === this.post.fileURLs.length) {
            this.loaded = true;
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this._ratingServe.getRatingByUserAndPostWithSessionStorageRequest(Guid.parse(this.paramId)).subscribe({
      next: (x: object) => {
        const isLike: boolean = Object.values(x)[3];

        this.changeColorOfVoteButton(isLike, !isLike);
      }
    });

    this._defaultShareBtnInnerHTML = this.shareBtn.nativeElement.innerHTML;
  }

  goToAuthorProfile(): void {
    this._router.navigate(['/profile/' + this.user.userName]);
  }

  goToPostPage(): void {
    this._router.navigate(['/post/' + this.post.postId]);
  }

  toggleEditing(): void {
    this.editingPost = !this.editingPost;
  }

  onFileUpload(event: any): void {
    this.files.push(...event.target.files);
    this.editPostFormGroup.get('fileUpload')?.reset();
  }

  removeAttachment(fileName: string): void {
    this.files = this.files.filter(x => x.name !== fileName);
  }

  editPost(): void {
    const newMessage = this.editPostFormGroup.get('newPostMessage')?.value;

    if (newMessage !== '') {
      this._postService.putPostWithSessionStorageRequest(Guid.parse(this.paramId), newMessage, this.files).subscribe({
        next: () => {
          this.reloadPage();
        }
      });
      this.loaded = false;
    }
  }

  deletePost(): void {
    this._postService.deletePostWithSessionStorage(Guid.parse(this.paramId)).subscribe({
      next: () => {
        this._router.navigate(['/profile/' + this._tokenService.getUsernameFromSessionStorageToken()]);
      }
    });
  }

  private reloadPage(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
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
    this._renderer.setStyle(this.upvoteBtn.nativeElement, 'backgroundColor', (isUpvoted) ? 'var(--upvote-highlight)' : 'inherit');
    this._renderer.setStyle(this.downvoteBtn.nativeElement, 'backgroundColor', (isDownvoted) ? 'var(--downvote-highlight)' : 'inherit');
  }

  resetShareBtn(): void {
    if (this._linkShared) {
      this._renderer.setProperty(this.shareBtn.nativeElement, 'innerHTML', this._defaultShareBtnInnerHTML);
      this._linkShared = false;
    }
  }

  showCopiedMessage(): void {
    this._renderer.setProperty(this.shareBtn.nativeElement, 'innerHTML', 'Link copied to clipboard!');
    this._linkShared = true;
  }

  getPostLink(): string {
    return AppConstants.API_POST_URL + '/' + this.paramId;
  }
}
