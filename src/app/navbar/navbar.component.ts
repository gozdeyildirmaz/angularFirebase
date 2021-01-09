import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ThisReceiver} from '@angular/compiler';
import {GlobalConstants} from '../global-constants';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username = '';
  user;
  showEditorTool: boolean = false;
  showAdminTool: boolean = false;


  constructor(public auth: AngularFireAuth, private router: Router, public authService: AuthService) {

    this.username = window.sessionStorage.getItem('username');
  }

  ngOnInit(): void {
debugger;
    this.user = GlobalConstants.getUser();
    if (this.user.role == 2) {
      this.showEditorTool = true;
    } else if (this.user.role == 1) {
      this.showAdminTool = true;
    }
  }

  logout(): void {

    this.authService.logout().subscribe(res => {
      console.error('LOGOUT başarılı: ');
      this.router.navigate(['/login']);


    }, err => {
      console.error('Error: ' + err);
    });
  }
}
