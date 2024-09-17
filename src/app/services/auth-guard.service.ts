import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService:AuthService,private router :Router) { }

  canActivate() {
    return this.authService.IsLogged().pipe(
      tap((userIsloggedIn)=>{
      if(!userIsloggedIn) this.router.navigate(['/']);
      })
    );
  }
}
