import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private IsLoggedIn$ = new BehaviorSubject<boolean>(false);
  private UserDetails$ = new BehaviorSubject<User | null>(null);

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, user => {
      console.log('efrattt AuthService - onAuthStateChanged user:', user);
      if (user) {
        this.UserDetails$.next(user as User);
        const userString = JSON.stringify(user);
        localStorage.setItem('user', userString);
        if (this.IsLoggedIn$.getValue() === false) {
          // If not already set to true, update the value
          this.IsLoggedIn$.next(true);
        }
        console.log('efrattt AuthService - User logged in');
      } else {
        if (this.IsLoggedIn$.getValue() === true) {
          // If not already set to false, update the value
          this.IsLoggedIn$.next(false);
        }
        localStorage.removeItem('user');
        console.log('efrattt AuthService - User logged out');
      }
      console.log('efrattt AuthService - IsLoggedIn$', this.IsLoggedIn$.getValue());
    });
  }
  

  public IsLogged(): Observable<boolean> {
    return this.IsLoggedIn$.asObservable().pipe(
      tap(isLoggedIn => {
        console.log('efrattt AuthService IsLogged:', isLoggedIn);
      })
    );
  }

  public signOut(): Promise<void> {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
      this.UserDetails$.next(null);
    });
  }

  public signInWithGoogle() {
    this.authLogin(new GoogleAuthProvider());
  }

  private authLogin(provider: GoogleAuthProvider) {
    return signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
      this.setUserData(result.user as User);
    });
  }

  private setUserData(user?: User): Promise<void> | void {
    if (!user) return;

    const userRef = doc(this.firestore, `users/${user.uid}`);

    return setDoc(userRef, {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null
    }, { merge: true });
  }
}
