import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100)); // עיכוב של 100ms
    return this.authService.IsLogged().toPromise().then(userIsLoggedIn => {
      console.log('efrattt AuthGuardService - User is logged in:', userIsLoggedIn);
      if (!userIsLoggedIn) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    });
  }
  
}
