import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.IsLogged().pipe(
      tap(userIsLoggedIn => {
        console.log('efrattt AuthGuardService - User is logged in:', userIsLoggedIn);
        if (!userIsLoggedIn) {
          this.router.navigate(['/']);
        }
      }),
      map(userIsLoggedIn => userIsLoggedIn) // מחזיר true או false
    );
  }
}
