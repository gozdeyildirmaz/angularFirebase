import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {filter, map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {Event} from '@angular/router';
import {GlobalConstants} from './global-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-firebase';
  users: Observable<any[]>;
  firestore: any;
  isLogged: boolean = false;
  showNavbar: boolean = false;

  constructor(firestore: AngularFirestore, public auth: AngularFireAuth, public authService: AuthService, private router: Router) {
    this.firestore = firestore;
    this.users = firestore.collection('users').valueChanges();
    this.showNavbar = false;

    // this.router.events.pipe(
    //   filter<NavigationEnd>(e => e instanceof NavigationEnd)
    // ).subscribe(
    //   // e is inferred as NaviagtionEnd
    //   e => {
    //     if (e.urlAfterRedirects !== '/login' && e.urlAfterRedirects !== '/signup') {
    //       this.showNavbar = true;
    //
    //     } else {
    //       this.showNavbar = false;
    //     }
    //   }
    // );
  }


  // ngOnInit(): void {
  //   this.authService.verifySession().pipe(map((res) => {
  //     if (res.status === 'success') {
  //       this.showNavbar = true;
  //     } else {
  //       this.showNavbar = false;
  //     }
  //   }));
  //
  // }


  logout() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  isLoggedInisLoggedIn() {
    this.isLogged = firebase.auth().currentUser != null ? true : false;
    // console.log(firebase.auth().currentUser.name);
    // console.log(firebase.auth().currentUser.getIdToken());
    // firebase.auth().currentUser.
  }


}
