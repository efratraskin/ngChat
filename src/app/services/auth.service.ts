import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router:Router
  ) {
   
  }

  public signInWithGoogle() {
    this.authLogin(new GoogleAuthProvider());
  }
  
  private authLogin(provider: GoogleAuthProvider) {
    return signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
      this.setUserData(result.user as User)
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
  public signOut():Promise<void>
  { 
    return this.auth.signOut().then(()=>{
     this.router.navigate(["/"]);
    });

  }
}
