import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/models/identity/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: User;

  constructor(private _router: Router, private _userService: UserService, private _tokenService: TokenService)
  { }

  ngOnInit(): void {
    if (!this._tokenService.getTokenFromSessionStorage()) {
      this._router.navigate(['/login']);
      return;
    }

    this.user = this._userService.getDefaultUser();

    this._userService.getUserFromSessionStorageRequest().subscribe({
      next: (res: object) => {
        Object.assign(this.user, res);
      },
    });
  }

  goToProfile(): void {
    this._router.navigate(['/profile/' + this.user.userName]);
  }

  goToFeed(): void {
    this._router.navigate(['/']);
  }

  goToSettings(): void {
    this._router.navigate(['/profile/' + this.user.userName + '/settings']);
  }

  logout(): void {
    this._tokenService.logoutUserFromSessionStorage();
    this._router.navigate(['/login']);
  }
}
