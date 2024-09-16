import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private IsLoggedIn$ :BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false)
  private UserDetails$ : Subject<User | null> = new Subject<User | null>();
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, user => {
      const useresSaved=localStorage.getItem('user')
      if(useresSaved != null)
      {
        this.IsLoggedIn$.next(true)
      }
      if (!!user) {
        this.UserDetails$.next(<User>user)
        const userString = JSON.stringify(user);
        localStorage.setItem('user', userString);
        this.IsLoggedIn$.next(true)
      } else {
        this.IsLoggedIn$.next(false)
        localStorage.removeItem('user')
      }
    });
  }
public IsLogged():Observable<boolean>
{
  return this.IsLoggedIn$.asObservable()
}
public signOut(): Promise<void> {
  return this.auth.signOut().then(() => {
    localStorage.removeItem('user')
    this.router.navigate(["/"]);
    this.UserDetails$.next(null)

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
