import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';
import { TokenService } from 'src/app/services/token.service';
import { Post } from 'src/models/post.model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  private _title = 'Post';
  public dataArrived = false;
  public loggedIn = false;
  public postId: Guid;
  public post: Post;
  public addCommentFormGroup: FormGroup;

  constructor(private _titleService: Title, private _router: Router, private _fb: FormBuilder, private _tokenService: TokenService, private _postService: PostService, private _commentService: CommentService) {
    this._titleService.setTitle(this._title);
  }

  ngOnInit(): void {
    this.loggedIn = this._tokenService.getTokenFromSessionStorage() !== '';
    this.postId = Guid.parse(this._router.url.substring(6));

    // Gets the post and the logged in user and compares them,
    // to determine if the current post is made by the user
    this._postService.getPostRequest(this.postId).subscribe({
      next: (result: object) => {
        this.post = result as Post;
        this.post.fileURLs = Object.values(result)[7];

        this.dataArrived = true;
      },
      error: () => {
        this._router.navigate(['/not-found']);
      }
    });

    this.addCommentFormGroup = this._fb.group({
      newComment: new FormControl('')
    });
  }

  addComment(): void {
    if (!this.loggedIn) {
      this._router.navigate(['/login']);
      return;
    }

    const newComment = this.addCommentFormGroup.get('newComment')?.value;
    if (newComment !== '' && newComment !== null) {
      this._commentService.createCommentWithSessionStorageRequest(this.postId, newComment).subscribe({
        next: () => {
          this.reloadPage();
        }
      });
    }
  }

  private reloadPage(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
  }
}
