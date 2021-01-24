import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd,
  NavigationStart,
  ActivationStart,
  Router,
  RouterStateSnapshot,
  UrlTree, ActivatedRoute
} from '@angular/router';
import {Observable, ObservableInput, throwError} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';
import {catchError, combineAll, concatMap, filter, map, tap} from 'rxjs/operators';
import {GlobalConstants} from './global-constants';
import {hasProperties} from 'codelyzer/util/astQuery';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router, public route: ActivatedRoute) {
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
debugger;
    const authService = this.authService;

    const url = route.url[0].path;

    if (url !== 'login' && url !== 'signup' && url !== '/') {
      if (GlobalConstants.getUser() == null) {

        return authService.verifySession().pipe(
          tap((response) => { // tap response u olduğu gibi dönüyor??
            if (response.status === 'fail') {
              throw ("fail");
            }

            // return response.status;
          }),
          concatMap((response) => {
            return authService.getUserByEmail(window.sessionStorage.getItem('userEmail'));
          }),
          map((response): any => {

            let user: any;
            user = response['docs'][0].data();
            GlobalConstants.keepUser(user);
            if ((url === 'admin' && GlobalConstants.canRouteAdmin()) || (url === 'editor' && GlobalConstants.canRouteEditor()) || url === 'home') {
              return true;
            } else if ((url === 'admin' && !GlobalConstants.canRouteAdmin()) || (url === 'editor' && !GlobalConstants.canRouteEditor())) {
              // return 'home';
              this.router.navigate(['/home']);
            }


          }),
          catchError((err) => {
            this.router.navigate(['/login']);
            return err;
          }),
          map(final => {
            if (final === true) {
              return true;
            }
          })
        );


        // res.pipe(map(x => {
        //     console.log(x);
        //     if (x === 'fail') {
        //       return false;
        //     } else if (x === true) {
        //       return true;
        //     } else if (x === 'home') {
        //       this.router.navigate(['/home']);
        //     }
        //   })
        // );


// return authService.verifySession().pipe(map((res) => {
//   console.log(res);
//   if (res.status === 'success') {
//     // return true;
//
//
//     return authService.getUserByEmail(window.sessionStorage.getItem('userEmail'))
//       .pipe(map(ss => {
//         let user: any;
//         ss.docs.forEach(doc => {
//           user = doc.data();
//           GlobalConstants.keepUser(user);
//           if ((url === 'admin' && GlobalConstants.canRouteAdmin()) || (url === 'editor' && GlobalConstants.canRouteEditor()) || url === 'home') {
//             return true;
//           } else if ((url === 'admin' && !GlobalConstants.canRouteAdmin()) || (url === 'editor' && !GlobalConstants.canRouteEditor())) {
//             this.router.navigate(['/home']);
//           }
//
//         });
//       }));
//
//
//   } else {
//     this.router.navigate(['/login']);
//     // return false;
//   }
// }));


// this.authService.getUserByEmail(window.sessionStorage.getItem('userEmail'))
//   .subscribe(ss => {
//     let user: any;
//     ss.docs.forEach(doc => {
//       user = doc.data();
//       GlobalConstants.keepUser(user);
//       if ((url === 'admin' && GlobalConstants.canRouteAdmin()) || (url === 'editor' && GlobalConstants.canRouteEditor()) || url === 'home') {
//         return authService.verifySession().pipe(map((res) => {
//           console.log(res);
//           if (res.status === 'success') {
//             return true;
//           } else {
//             this.router.navigate(['/login']);
//           }
//         }));
//       } else if ((url === 'admin' && !GlobalConstants.canRouteAdmin()) || (url === 'editor' && !GlobalConstants.canRouteEditor())) {
//         this.router.navigate(['/home']);
//       }
//
//     });
//   });


      } else {
        if ((url === 'admin' && GlobalConstants.canRouteAdmin()) || (url === 'editor' && GlobalConstants.canRouteEditor()) || url === 'home') {
          return this.authService.verifySession().pipe(map((res) => {
            console.log(res);
            if (res.status === 'success') {
              return true;
            } else {
              this.router.navigate(['/login']);
              // return false;
            }
          }));
        } else if ((url === 'admin' && !GlobalConstants.canRouteAdmin()) || (url === 'editor' && !GlobalConstants.canRouteEditor())) {
          this.router.navigate(['/home']);
        }
      }
    } else { // login veya signup ise
      // this.router.navigate(['/' + url]);
      return true;
    }


// this.router.events.pipe(
//   filter<NavigationStart>(e => e instanceof NavigationStart)
// ).subscribe(
//   e => {
//     console.log('URL :', e.url);
//     // console.log('URL AFTER:', e.urlAfterRedirects);
//     //
//     //
//     // if (e.urlAfterRedirects !== '/login' && e.urlAfterRedirects !== '/signup' && e.urlAfterRedirects !== '/') {
//     //   if (GlobalConstants.getUser() == null) {
//     //     this.authService.getUserByEmail(window.sessionStorage.getItem('userEmail'))
//     //       .subscribe(ss => {
//     //         let user: any;
//     //         ss.docs.forEach(doc => {
//     //           user = doc.data();
//     //           GlobalConstants.keepUser(user);
//     //         });
//     //       });
//     //   }
//     //
//     //
//     //   return this.authService.verifySession().pipe(map((res) => {
//     //     console.log(res);
//     //     if (res.status === 'success') {
//     //       return true;
//     //     } else {
//     //       this.router.navigate(['/login']);
//     //       return false;
//     //     }
//     //   }));
//     // } else {
//     //   return true;
//     // }
//
//
//   }
// );
// // return false;

  }
}
