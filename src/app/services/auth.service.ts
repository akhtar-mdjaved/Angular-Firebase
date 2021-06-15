import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn: boolean;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore ) {
      this.userLoggedIn = false;

      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.userLoggedIn = true;
        } else {
          this.userLoggedIn = false;
        }
      });
     }

     logInUser(email: string, password: string): Promise<any> {
       return this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Auth Service: loginUser: success');
          this.router.navigate(['/dashboard']);
        }).catch (error => {
          console.log('Auth Service: login error...');
          console.log('error code', error.code);
          console.log('error', error);
          if (error.code) {
            return { isValid: false, message: error.message};
          }
        });
     }

     signUpUser(user: any): Promise <any> {
       return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          let emailLower = user.email.toLowerCase();

          this.afs.doc('/users/' + emailLower)
            .set({
              accountType: 'endUser',
              displayName: user.displayName,
              displayName_lower: user.displayName.toLowerCase(),
              email: user.email,
              email_lower: emailLower
            });

            result.user.sendEmailVerification();
        })
        .catch(error => {
          console.log('Auth Service: signup error', error);
          if (error.code)
            return { isValid: false, message: error.message};
        });
     }

     resetPassword(email: string): Promise <any> {
       return this.afAuth.sendPasswordResetEmail(email)
        .then(() => {
          console.log('Auth Service: reset password success');
          // this.router.navigate(['/amount']);
        })
     }
}
