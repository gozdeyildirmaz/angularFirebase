import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {GlobalConstants} from './global-constants';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // .subscribe'in içine return dediğimizde ISubscribe döndürür o yüzden return kullanabilmek için .pipe ve map kullandık
    // return this.authService.getCurrentUser().pipe(map((user) => {
    //   if (user && user.email) {
    //     return true;
    //   } else {
    //     this.router.navigate(['/login']);
    //   }
    // }));


    // sayfa f5'lendiğinde GlobalConstants daki user bilgisi yok olacağı için o durumu konrol edip user yok ise tekrar doldurma işlemini yaptık
    // böylece her an GlobalConstants altında user'ımız mevcut oldu.

    if (this.router.url !== '/login' && this.router.url !== '/signup') {
      if (GlobalConstants.getUser() == null) {
        this.authService.getUserByEmail(window.sessionStorage.getItem('userEmail'))
          .subscribe(ss => {
            let user: any;
            ss.docs.forEach(doc => {
              user = doc.data();
              GlobalConstants.keepUser(user);
            });
          });
      }
    }


    return this.authService.verifySession().pipe(map((res) => {
      console.log(res);
      if (res.status === 'success') {
        return true;
      } else {
        this.router.navigate(['/login']);
        // return false;
      }
    }));


  }
}
