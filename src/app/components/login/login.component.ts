import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorBarComponent } from '../error-bar/error-bar.component';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(ErrorBarComponent) private _errorBar: ErrorBarComponent;
  private _title = 'Login';
  public loginUserFormGroup: FormGroup;
  public showingPassword = false;

  constructor(private _titleService: Title, private _fb: FormBuilder, private _router: Router, private _userService: UserService, private _tokenService: TokenService) {
    this._titleService.setTitle(this._title);
  }

  ngOnInit(): void {
    this.loginUserFormGroup = this._fb.group({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  toggleShowPassword(): void {
    this.showingPassword = !this.showingPassword;
  }

  onSubmit(): void {
    this._errorBar.hideError();
    this._userService.loginUserRequest(this.loginUserFormGroup).subscribe({
        next: (res: object) => {
          this._tokenService.setUserTokenToSessionStorage(res);
          this._router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this._errorBar.showError(err);
        }
    });
  }

  onRedirectRegister(): void {
    this._router.navigate(['/register']);
  }
}
