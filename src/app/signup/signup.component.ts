import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
  });

  errorMessage = '';

  constructor(private  toastr: ToastrService, private router: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  signup() {
    this.authService.createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
      .subscribe((result) => {
        if (result.additionalUserInfo.isNewUser) {
          const user = result.user;
          this.authService.addUser(this.signupForm.value.name, this.signupForm.value.surname, this.signupForm.value.email, user.uid, 3);
          window.sessionStorage.setItem('username', (this.signupForm.value.name + ' ' + this.signupForm.value.surname).toString());

          this.toastr.success('Congrats!', 'You signed up.');
          this.router.navigate(['/home']);
        }
      }, (error) => {
        this.errorMessage = error.message;
        if (error.code == 'auth/email-already-in-use') {
          this.errorMessage = 'The email address is already in use by another account or ';
        }
      });
  }

}
