import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {defer, from, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {UrlTree} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  verifySession(): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('http://localhost:8080/verifySession', {}, {headers: headers, withCredentials: true});
  }
}
