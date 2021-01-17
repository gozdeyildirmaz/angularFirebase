import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any = [];

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = [];

      users.forEach(user =>
        this.users.push(user.payload.doc.data())
      );

    });
  }

  checkChange(user) {
    let newRole = user.role == 2 ? 3 : 2;

    this.authService.updateUserRole(user.id, newRole);

  }

}
