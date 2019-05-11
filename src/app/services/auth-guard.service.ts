import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of as observableOf  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<any> {
    return this.authService.isAuthenticated().pipe(
      map(e => {
        return true;
      }),
      catchError((err)=>{
        console.log(err);
        this.authService.logout();
        return observableOf(false);
      })
    );
  }

  constructor(private authService:AuthService, private router:Router) { }

}
