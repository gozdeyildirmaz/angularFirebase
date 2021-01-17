import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {defer, from, Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {UrlTree} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public itemDoc: AngularFirestoreDocument<any>;

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore, public http: HttpClient) {
  }

  logout2() {
    return this.auth.signOut();

    // this.auth.signOut().then(result => {
    // });

  }

  // logout = from(this.auth.signOut()); // promise'in observable a dönüşmesi için from kullanılır.
  // promise dönenler için observable bu şekilde kullanılıyor //https://angular.io/guide/rx-library
  // peki neden promise'i observable a çevirelim sonuçta iki türlüde value dönüyor?
  // Çünkü observable olması rxjs sayesinde reactiviteyi sağlar. Yani bir veri değiştiği zaman DOM otomatikmen güncellenir <3
  // Yanlız Promise i observable a dönüştürürken sadece from kullanmak observable'ımızın lazy olmasını sağlamaz. Lazy olması demek .subscribe() methodu çağrılmadan istek
  // atılmaz demek. Sadece from kullanırsak istek .subscribe() öağrılmadan atılır. Gerçekten lazy olması için (ki observable ın en büyük avantajı zaten lazy olmasıdır.)
  // defer(() => from(fetch(url))); gibi defer operatörünü kullanmak gerekir. Kaynak aşağıda.
  // https://dev.to/frederikprijck/converting-a-promise-into-an-observable-dag#:~:text=When%20working%20with%20rxjs%2C%20you,combine%20it%20with%20other%20streams.

  logout(): Observable<any> {
    console.log('sessionLogout çağrıldı');
    return this.http.post<any>('http://localhost:8080/sessionLogout', {}, {withCredentials: true});

    // return defer(() => from(this.auth.signOut()));
  }

  login(email: string, password: string): Observable<any> {
    return defer(() => from(this.auth.signInWithEmailAndPassword(email, password)));
  };

  // login: (email: string, password: string) => Promise<any> = function(email: string, password: string): Promise<any> {  // promise retun eden func. bu şekilde tanımlanır
  //   return this.auth.signInWithEmailAndPassword(email, password);
  // };

  getCurrentUser(): Observable<any> {
    return defer(() => from(this.auth.currentUser));
  };


  getUserByEmail(email: string): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).get();
  }

  getAllUsers(): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('role', '>', 1).orderBy('role')).snapshotChanges();
  }

  updateUserRole(userid, newrole): void {

    /*
    * You would use .snapshotChanges() whenever you want to get the metadata of a doc (e.g. DocumentID)
    * and .valueChanges() when you need the data within the doc. You can't get document data from .snapshotChanges().
    * */


    // const tutorialsRef = this.firestore.collection('users', ref => ref.where('id', '==', userid));
    const tutorialsRef = this.firestore.collection('users', ref => ref.where('id', '==', userid)).snapshotChanges().pipe(
      take(1), // take olmayınca snapshotChanges'da data her değiştiğinde buraya düşüyor 1 kere düşssün diye yapıldı. snapshotChanges  yerine başka bişe kullansaydık bu sefer docId yi yakalayamıyorduk o yğzden mecbur
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return id;
      }))).subscribe((docId: any) => {
      // let id = _doc[0].payload.doc.id; //first result of query [0]
      this.firestore.doc(`users/${docId}`).update({role: newrole});
    });
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<any> {
    return defer(() => from(this.auth.createUserWithEmailAndPassword(email, password)));
  }

  addUser(name: string, surname: string, email: string, id: string, role: number): void {
    this.firestore.collection('users').add({
      name,
      surname,
      email,
      id,
      role
    });
  }

  addBook(title: string, olid: string): Promise<any> {
    return this.firestore.collection('books').add({
      title,
      olid
    });
  }

  deleteBook(olid: string): void {

    const tutorialsRef = this.firestore.collection('books', ref => ref.where('olid', '==', olid)).snapshotChanges().pipe(
      take(1), // take olmayınca snapshotChanges'da data her değiştiğinde buraya düşüyor 1 kere düşssün diye yapıldı. snapshotChanges  yerine başka bişe kullansaydık bu sefer docId yi yakalayamıyorduk o yğzden mecbur
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return id;
      }))).subscribe((docId: any) => {
      // let id = _doc[0].payload.doc.id; //first result of query [0]
      this.firestore.doc(`books/${docId}`).delete();
    });
  }

  getAllBooks(): Observable<any> {
    return this.firestore.collection('books').valueChanges();
  }

  verifySession(): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('http://localhost:8080/verifySession', {}, {headers: headers, withCredentials: true});
  }
}
