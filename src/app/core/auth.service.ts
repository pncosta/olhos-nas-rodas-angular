import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";
// https://itnext.io/part-2-complete-step-by-step-firebase-authentication-in-angular-2-25d284102632

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

@Injectable()
export class AuthService {
  // private user: Observable<firebase.User>;
  user: Observable<User>;
  private userDetails: User = null;

  constructor(private _firebaseAuth: AngularFireAuth,
              private _firebaseStore: AngularFirestore,
              private router: Router) {

    //// Get auth data, then get firestore user document || null
    this.user = this._firebaseAuth.authState
      .switchMap(user => {
        if (user) {
          return this._firebaseStore.doc<User>(`users/${user.uid}`).valueChanges()
        }
        return Observable.of(null)
      });

    this.user.subscribe(
      (user) => { this.userDetails = user ? user : null; }
    ); 
  }
  
  signup(email: string, password: string) {
    this._firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user) // create initial user document
      })
      .catch(error => this.handleError(error) );  
  }

  login(email: string, password: string) {

    let promise = new Promise((resolve, reject) => {
      this._firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        resolve(value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        reject(err);
      });   
     });
    
      return promise;
 
    }

  isLoggedIn() {
    return this.userDetails != null;
  }

  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this._firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.setUserDoc(credential.user)
      })
  }

   // Update properties on the user document
   updateUser( data: any) { 

     console.log(data);

    return this._firebaseStore.doc(`users/${this.userDetails.uid}`).update(data)
  }

  private setUserDoc(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this._firebaseStore.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true })

  }

  logInWithPopup() {
    //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

    // If error, console log and notify user
    private handleError(error) {
      console.error(error)
    }


}