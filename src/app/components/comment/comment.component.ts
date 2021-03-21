import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { CommentService } from 'src/app/services/comment.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/models/comment.model';
import { User } from 'src/models/identity/user.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  public loaded = false;
  public loggedInAuthor = false;
  public editingComment = false;
  public user: User;
  public comment: Comment;
  public timeCreated: string;
  @Input() paramId: string;
  public editCommentFormGroup: FormGroup;

  constructor(private _router: Router, private _commentService: CommentService, private _userService: UserService, private _tokenService: TokenService, private _fb: FormBuilder)
  { }

  ngOnInit(): void {
    this.comment = this._commentService.getDefaultComment();
    this.user = this._userService.getDefaultUser();

    this._commentService.getCommentRequest(Guid.parse(this.paramId)).subscribe({
      next: (result: object) => {
        Object.assign(this.comment, result);

        this.timeCreated = new Date(this.comment.timeCreated).toLocaleString('en-GB');
        this.loadUser();
      }
    });

    this.editCommentFormGroup = this._fb.group({
      newCommentMessage: new FormControl('')
    });
  }

  private loadUser(): void {
    this._userService.getUserByUsernameRequest(this.comment.issuerUsername).subscribe({
      next: (result: object) => {
        Object.assign(this.user, result);

        if (this._tokenService.getTokenFromSessionStorage() !== '') {
          this.loggedInAuthor = this._tokenService.getUsernameFromSessionStorageToken() === this.comment.issuerUsername;
          this.editCommentFormGroup.get('newCommentMessage')?.setValue(this.comment.message);
        }

        this.loaded = true;
      }
    });
  }

  goToAuthorProfile(): void {
    this._router.navigate(['/profile/' + this.comment.issuerUsername]);
  }

  toggleEditing(): void {
    this.editingComment = !this.editingComment;
  }

  editComment(): void {
    if (this._tokenService.getTokenFromSessionStorage() === '') {
      this._router.navigate(['/login']);
      return;
    }

    if (this.editingComment) {
      const newMessage = this.editCommentFormGroup.get('newCommentMessage')?.value;

      if (newMessage !== '' && newMessage !== this.comment.message) {
        this._commentService.putCommentWithSessionStorageRequest(Guid.parse(this.paramId), this.comment.postId, newMessage).subscribe({
          next: () => {
            this.reloadPage();
          }
        });
      }
    }
    this.editingComment = !this.editingComment;
  }

  deleteComment(): void {
    this._commentService.deleteCommentWithSessionStorage(Guid.parse(this.paramId)).subscribe({
      next: () => {
        this.reloadPage();
      }
    });
  }

  private reloadPage(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
  }
}
