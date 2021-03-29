import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorBarComponent } from './components/error-bar/error-bar.component';
import { SuccessBarComponent } from './components/success-bar/success-bar.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { AdminPanelPageComponent } from './components/admin-panel-page/admin-panel-page.component';
import { CommentComponent } from './components/comment/comment.component';
import { PostAttachmentComponent } from './components/post-attachment/post-attachment.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommentPageComponent } from './components/comment-page/comment-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    PostComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    NotFoundComponent,
    LoadingComponent,
    ErrorBarComponent,
    SuccessBarComponent,
    PostPageComponent,
    AdminPanelPageComponent,
    CommentComponent,
    PostAttachmentComponent,
    NavbarComponent,
    CommentPageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
