import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user.service';
import { TechnologyService } from 'src/app/services/technology.service';
import { User } from 'src/models/identity/user.model';
import { ErrorBarComponent } from '../error-bar/error-bar.component';
import { SuccessBarComponent } from '../success-bar/success-bar.component';
import { Language } from 'src/models/language.model';
import { Technology } from 'src/models/technology.model';
import { TokenService } from 'src/app/services/token.service';
import { Title } from '@angular/platform-browser';
import { AppConstants } from 'src/app/app-constants.module';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  private _title = 'Profile Settings';
  @ViewChild(ErrorBarComponent) private _errorBar: ErrorBarComponent;
  @ViewChild(SuccessBarComponent) private _successBar: SuccessBarComponent;
  private _urlUsername: string;
  public isAdminUser = false;
  public dataArrived = false;
  public deleteAccountConfirm = false;
  public showLanguages = false;
  public showTechnologies = false;
  public updateUserFormGroup: FormGroup;
  public updateProfilePictureFormGroup: FormGroup;
  public newProfilePicture: File;
  public user: User;
  public chosenLanguages: Language[];
  public chosenTechnologies: Technology[];
  public availableLanguages: Language[];
  public availableTechnologies: Technology[];
  public showCurrentPassword = false;

  constructor(private _titleService: Title, private _router: Router, private _userService: UserService, private _profilePictureService: ProfilePictureService, private _languageService: LanguageService, private _technologyService: TechnologyService, private _tokenService: TokenService, private _fb: FormBuilder, private _location: Location) {
    this._titleService.setTitle(this._title);
  }

  ngOnInit(): void {
    this._urlUsername = this._router.url.substring(9);
    this._urlUsername = this._urlUsername.substring(0, this._urlUsername.length - 9);

    this.user = this._userService.getDefaultUser();
    this.availableLanguages = [];
    this.availableTechnologies = [];
    this.newProfilePicture = new File([], '');

    // Initializing forms with blank (default) values
    this.updateUserFormGroup = this._fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    });
    this.updateProfilePictureFormGroup = this._fb.group({
      fileUpload: new FormControl('')
    });

    this._userService.getUserByUsernameRequest(this._urlUsername).subscribe({
      next: (res: object) => {
        Object.assign(this.user, res);
        this.isAdminUser = this.user.roles.map(x => x.name).includes(AppConstants.ADMIN_ROLE_NAME);
        this.finishUserLoading();
      },
      error: () => {
        this._router.navigate(['/not-found']);
      }
    });
   }

  private finishUserLoading(): void {
    if (sessionStorage.getItem('UserCred')) {
      const userFromToken: User = this._userService.getDefaultUser();

      this._userService.getUserFromSessionStorageRequest().subscribe({
        next: (tokenRes: object) => {
          Object.assign(userFromToken, tokenRes);

          if (userFromToken.userName === this._urlUsername) {
            this.loadUserSecondaryInfo();
            this.initForms();
            this.dataArrived = true;
          }
          else {
            this.goToProfile();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
    else {
      this.goToProfile();
    }
  }

  private loadUserSecondaryInfo(): void {
    // Load languages and tehnologies of user
    this._languageService.getFullLanguagesFromIncomplete(this.user.languages).then(
      (result) => {
        this.chosenLanguages = result as Language[];
        this.loadAvailableLanguages();
      }
    );

    this._technologyService.getFullTechnologiesFromIncomplete(this.user.technologies).then(
      (result) => {
        this.chosenTechnologies = result as Technology[];
        this.loadAvailableTechnologies();
      }
    );
  }

  private loadAvailableLanguages(): void {
    this._languageService.getAllLanguagesWithSessionStorageRequest().subscribe({
      next: (result: object) => {
        const allAvailable = result as Language[];
        // Remove the chosen languages from all of the avaiable ones
        this.availableLanguages = allAvailable.filter(a => !this.user.languages.some(l => l.name === a.name));
      }
    });
  }

  private loadAvailableTechnologies(): void {
    this._technologyService.getAllTechnologiesWithSessionStorageRequest().subscribe({
      next: (result: object) => {
        const allAvailable = result as Technology[];
        // Remove the chosen technologies from all of the avaiable ones
        this.availableTechnologies = allAvailable.filter(a => !this.user.technologies.some(t => t.name === a.name));
      }
    });
  }

  private initForms(): void {
    this.updateUserFormGroup = this._fb.group({
      firstName: new FormControl(this.user.firstName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      username: new FormControl(this.user.userName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('.*[0-9].*') // Check if password contains atleast one number
      ]),
    });

    this.updateProfilePictureFormGroup = this._fb.group({
      fileUpload: new FormControl('')
    });

    this.updateUserFormGroup.valueChanges.subscribe({
      next: () => {
        this._successBar?.hideMsg();
        this._errorBar?.hideError();
      }
    });
  }

  onFileUpload(event: any): void {
    this.newProfilePicture = event.target.files[0];
  }

  updateProfilePicture(): void {
    if (this.newProfilePicture.size === 0) {
      return;
    }

    this._profilePictureService.putPictureWithSessionStorageRequest(this.newProfilePicture).subscribe({
      next: () => {
        this.reloadPage();
      }
    });
    this.dataArrived = false;
  }

  onSubmit(): void {
    this._successBar.hideMsg();
    this._errorBar.hideError();

    this.patchLanguagesControl();
    this.patchTechnologiesControl();

    this._userService.putUserFromSessionStorageRequest(this.updateUserFormGroup, this.chosenLanguages, this.chosenTechnologies, this.user.roles, this.user.friends).subscribe({
        next: () => {
          this._successBar.showMsg('Profile updated successfully!');

          // "Reload" page when changing username
          const newUsername = this.updateUserFormGroup.get('username')?.value;
          if (newUsername !== this._urlUsername) {
            this._router.navigate(['/profile/' + newUsername + '/settings']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this._errorBar.showError(err);
        }
    });
  }

  private patchLanguagesControl(): void {
    // Get user input
    const langControl = this.updateUserFormGroup.get('languageInput')?.value as string ?? '';

    if (langControl === '') {
      // Add the data to the form (to the value that is going to be sent)
      this.updateUserFormGroup.patchValue({
        languages : []
      });
    }
    else {
      const names = langControl.split(' ');

      // Transfer user input to objects of type { "name": "value" }
      const actualLanguages = [];
      for (const lName of names) {
        if (lName !== '') {
          actualLanguages.push({ name : lName });
        }
      }

      // Add the data to the form (to the value that is going to be sent)
      this.updateUserFormGroup.patchValue({
        languages : actualLanguages
      });
    }
  }

  private patchTechnologiesControl(): void {
    // Get user input
    const techControl = this.updateUserFormGroup.get('technologyInput')?.value as string ?? '';

    if (techControl === '') {
      // Add the data to the form (to the value that is going to be sent)
      this.updateUserFormGroup.patchValue({
        technologies : []
      });
    }
    else {
      const names = techControl.split(' ');

      // Transfer user input to objects of type { "name": "value" }
      const actualTechnologies = [];
      for (const tName of names) {
        if (tName !== '') {
          actualTechnologies.push({ name : tName });
        }
      }

      // Add the data to the form (to the value that is going to be sent)
      this.updateUserFormGroup.patchValue({
        technologies : actualTechnologies
      });
    }
  }

  langClick(name: string): void {
    if (this.chosenLanguages.some(c => c.name === name)) {
      const index = this.chosenLanguages.findIndex(t => t.name === name);

      this.availableLanguages.push(this.chosenLanguages[index]);
      this.chosenLanguages.splice(index, 1);
    }
    else {
      const index = this.availableLanguages.findIndex(t => t.name === name);

      this.chosenLanguages.push(this.availableLanguages[index]);
      this.availableLanguages.splice(index, 1);
    }
  }

  techClick(name: string): void {
    if (this.chosenTechnologies.some(c => c.name === name)) {
      const index = this.chosenTechnologies.findIndex(t => t.name === name);

      this.availableTechnologies.push(this.chosenTechnologies[index]);
      this.chosenTechnologies.splice(index, 1);
    }
    else {
      const index = this.availableTechnologies.findIndex(t => t.name === name);

      this.chosenTechnologies.push(this.availableTechnologies[index]);
      this.availableTechnologies.splice(index, 1);
    }
  }

  goToProfile(): void {
    this._router.navigate([this._router.url.substring(0, this._router.url.length - 9)]);
  }

  goToAdminPanel(): void {
    this._router.navigate(['/admin-panel']);
  }

  logout(): void {
    this._tokenService.logoutUserFromSessionStorage();
    this._router.navigate(['/login']);
  }

  toggleLanguages(): void {
    this.showLanguages = !this.showLanguages;
  }

  toggleTechnologies(): void {
    this.showTechnologies = !this.showTechnologies;
  }

  deleteAccount(): void {
    if (this.deleteAccountConfirm) {
      this._userService.deleteUserFromSessionStorageRequest().subscribe({
        next: () => {
          this.logout();
        },
        error: (err: HttpErrorResponse) => {
          this._errorBar.showError(err);
        }
      });
      this.dataArrived = false;
    }
    else {
      this.deleteAccountConfirm = true;
    }
  }

  private reloadPage(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
  }

  toggleShowPassword(index: number): void {
    switch (index) {
      case 0: this.showCurrentPassword = !this.showCurrentPassword;
    }
  }
}
