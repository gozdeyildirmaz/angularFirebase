import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ThisReceiver} from '@angular/compiler';
import {GlobalConstants} from '../global-constants';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username = '';
  user;
  showNavbar: boolean = false;
  showEditorTool: boolean = false;
  showAdminTool: boolean = false;
  currentHome: boolean = true;
  currentEditor: boolean = false;
  currentAdmin: boolean = false;


  constructor(public auth: AngularFireAuth, public router: Router, public authService: AuthService) {

    this.username = window.sessionStorage.getItem('username');

    this.router.events.pipe(
      filter<NavigationEnd>(e => e instanceof NavigationEnd)
    ).subscribe(
      e => {
        debugger;
        console.log('URL :', e.urlAfterRedirects);
        if (e.urlAfterRedirects !== '/login' && e.urlAfterRedirects !== '/signup') {
          this.currentHome = false;
          this.currentEditor = false;
          this.currentAdmin = false;
          this.showNavbar = true;


          if (e.urlAfterRedirects === '/admin') {
            this.currentAdmin = true;
          } else if (e.urlAfterRedirects === '/editor') {
            this.currentEditor = true;
          }



          if (GlobalConstants.canRouteEditor()) {
            this.showEditorTool = true;
          } else if (GlobalConstants.canRouteAdmin()) {
            this.showAdminTool = true;
          }

        }
      }
    );
  }

  ngOnInit(): void {
    // if (GlobalConstants.canRouteEditor()) {
    //   this.showEditorTool = true;
    // } else if (GlobalConstants.canRouteAdmin()) {
    //   this.showAdminTool = true;
    // }
  }

  logout(): void {

    this.authService.logout().subscribe(res => {
      debugger;
      console.error('LOGOUT başarılı: ');
      this.router.navigate(['/login']);


    }, err => {
      debugger;

      console.error('Error: ' + err);
    });
  }
}
