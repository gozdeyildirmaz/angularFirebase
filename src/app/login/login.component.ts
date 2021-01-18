import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalConstants} from '../global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  showUserNotFound = false;
  showWrongSomething = false;
  firestore: any;
  db: any;
  // nodeServerUrl = 'http://localhost:8080';
  nodeServerUrl = 'https://gozdeyildirmaz.github.io/angularFirebase';

  constructor(private router: Router, firestore: AngularFirestore, db: AngularFireDatabase, public auth: AngularFireAuth, public authService: AuthService, public http: HttpClient) {
    this.firestore = firestore;
    this.db = db;
  }

  ngOnInit(): void {
    this.http.get(this.nodeServerUrl + '/init', {withCredentials: true}).subscribe();
  }

  login() {


    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(data => {

      data.user.getIdToken().then(idToken => {
        // Session login endpoint is queried and the session cookie is set.
        // CSRF protection should be taken into account.
        // ...
        const csrfToken = this.getCookie('csrfToken');
        this.http.post<any>(this.nodeServerUrl + '/sessionLogin', {
          'idToken': idToken,
          'csrfToken': csrfToken
        }, {headers: headers, withCredentials: true}).subscribe(data => {
          // this.postId = data.id;
          this.router.navigate(['/home']);

        });
      })
      ;

      this.authService.getUserByEmail(this.loginForm.value.email)
        .subscribe(ss => {
          let user: any;
          ss.docs.forEach(doc => {
            user = doc.data();
          });
          GlobalConstants.keepUser(user);
          window.sessionStorage.setItem('username', (user.name + ' ' + user.surname).toString());
          window.sessionStorage.setItem('userEmail', (user.email).toString());
        });

    }, error => {
      if (error.code === 'auth/wrong-password') {
        this.showWrongSomething = true;
      }
      if (error.code === 'auth/user-not-found') {
        this.showUserNotFound = true;
      }
    });
  }


  getCookie(name): any {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }


}
