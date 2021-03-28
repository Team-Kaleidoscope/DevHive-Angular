import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.css']
})
export class CommentPageComponent implements OnInit {
  private _title = 'Comment';
  public dataArrived = false;
  public postId: Guid;
  public commentId: Guid;

  constructor(private _titleService: Title, private _router: Router, private _commentService: CommentService) {
    this._titleService.setTitle(this._title);
  }

  ngOnInit(): void {
    this.commentId = Guid.parse(this._router.url.substring(9));
    this.postId = Guid.createEmpty();

    this._commentService.getCommentRequest(this.commentId).subscribe({
      next: (result: object) => {
        this.postId = Object.values(result)[1];

        this.dataArrived = true;
      },
      error: () => {
        this._router.navigate(['/not-found']);
      }
    });
  }

  goToPostPage(): void {
    this._router.navigate(['/post/' + this.postId]);
  }
}
