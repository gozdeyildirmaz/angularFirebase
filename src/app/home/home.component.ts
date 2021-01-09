import {Component, OnInit} from '@angular/core';
import {faUser as fasUser} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import * as myModule from '../../assets/js/readapi-automator.js';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';


// declare global {
//   interface Window {
//     jQuery: typeof jQuery;
//     $: typeof jQuery;
//   }
// }


// declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  username = '';

  constructor(library: FaIconLibrary, private router: Router, public auth: AngularFireAuth) {


    library.addIcons(fasUser);


  }

  ngOnInit(): void {
    const q = myModule.ol_readapi_automator.create_query();
    myModule.ol_readapi_automator.do_query(q);
  }


}
