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


    this.router.events.pipe(
      filter<NavigationEnd>(e => e instanceof NavigationEnd)
    ).subscribe(
      e => {
        // console.log('URL :', e.urlAfterRedirects);
        if (e.urlAfterRedirects !== '/login' && e.urlAfterRedirects !== '/signup') {
          this.username = window.sessionStorage.getItem('username');
          this.currentHome = false;
          this.currentEditor = false;
          this.currentAdmin = false;
          this.showNavbar = true;
          this.showEditorTool = false;
          this.showAdminTool = false;


          if (e.urlAfterRedirects === '/admin') {
            this.currentAdmin = true;
            console.log("admin ",  this.currentAdmin);
          } else if (e.urlAfterRedirects === '/editor') {
            this.currentEditor = true;
          } else {
            this.currentHome = true;
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
    this.showNavbar = false;
    this.authService.logout().subscribe(res => {
      console.error('LOGOUT başarılı: ');
      this.router.navigate(['/login']);


    }, err => {

      console.error('Error: ' + err);
    });
  }
}
