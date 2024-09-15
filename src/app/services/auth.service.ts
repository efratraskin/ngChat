import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // ייבוא של Firebase

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  public signInWithGoogle() {
    this.authLogin(new firebase.auth.GoogleAuthProvider());
  }
   
  private authLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider).then((res) => {
      console.log(res);
    }).catch((error) => {
      console.error("Error during sign-in: ", error);
    });
  }
}
