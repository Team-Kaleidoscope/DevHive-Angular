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
  public loggedIn: Boolean;

  constructor(private _router: Router, private _userService: UserService, private _tokenService: TokenService)
  { }

  ngOnInit(): void {
    this.loggedIn = this._tokenService.getTokenFromSessionStorage() !== '';

    this.user = this._userService.getDefaultUser();

    if (this.loggedIn) {
      this._userService.getUserFromSessionStorageRequest().subscribe({
        next: (res: object) => {
          Object.assign(this.user, res);
        },
      });
    }
  }

  goToProfile(): void {
    // Properly reload the page
    // Needed because if you're on someone's profile and go to yours, angular won't refresh the page (with your info)
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';

    this._router.navigate(['/profile/' + this.user.userName]);
  }

  goToFeed(): void {
    if (this.loggedIn) {
      this._router.navigate(['/']);
    }
    else {
      this.goToLogin();
    }
  }

  goToSettings(): void {
    this._router.navigate(['/profile/' + this.user.userName + '/settings']);
  }

  logout(): void {
    this._tokenService.logoutUserFromSessionStorage();
    this.goToLogin();
  }

  goToLogin(): void {
    this._router.navigate(['/login']);
  }
}
