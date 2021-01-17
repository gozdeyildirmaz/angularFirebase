import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  bookForm = new FormGroup({
    title: new FormControl(''),
    olid: new FormControl()
  });
  books:[]

  constructor(public authService: AuthService, private toastr: ToastrService) {
    this.authService.getAllBooks().subscribe(books => {
      this.books = books;
    });
  }

  ngOnInit(): void {
  }

  addBook(): void {
    this.authService.addBook(this.bookForm.value.title, this.bookForm.value.olid).then(res => {
      this.toastr.success('Book was added successfully!');
      this.bookForm.reset();

    }).catch(err => {
      this.toastr.success('Book was not added!', 'Error');
    });
  }

  deleteBook(olid):void{
    this.authService.deleteBook(olid)
  }

}
