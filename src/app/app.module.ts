import * as $ from 'jquery';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {HomeComponent} from './home/home.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavbarComponent} from './navbar/navbar.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {GuardService} from './guard.service';
import {HttpClientModule} from '@angular/common/http';
import {AdminComponent} from './admin/admin.component';
import {EditorComponent} from './editor/editor.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent, canActivate: [GuardService]}, // canActivate hepsine yazıldı içinde url e göre kontroller var
      {path: 'signup', component: SignupComponent, canActivate: [GuardService]},
      {path: 'home', component: HomeComponent, canActivate: [GuardService]},
      {path: 'editor', component: EditorComponent, canActivate: [GuardService]},
      {path: 'admin', component: AdminComponent, canActivate: [GuardService]},
      {path: '**', redirectTo: '/login'}
    ]),
    FontAwesomeModule

  ],
  providers: [GuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
