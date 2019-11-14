import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { isNullOrUndefined } from 'util';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }

    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }

    private updateUserData(user) {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      return userRef.set(data, { merge: true })

    }

    async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
    }

    async isAuthenticated() {
      let result:boolean;
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        if (user == null)
          result = false;
        else
          result = true;
      });
      return result;
    }

    async hasVillage() {
      let result:boolean;
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        if (isNullOrUndefined(user.villages) || user.villages.length == 0)
          result = false;
        else
          result = true;
      });
      return result;
    }

    async isVillageOwner(villageId:string) {
      let result;
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        result = user.villages.find(function(element:string) {
          return element.localeCompare(villageId) == 0;
        }) != undefined;
      });
      return result;
    }

    async addVillage(villageId:string) {
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        if (isNullOrUndefined(user.villages))
          user.villages = [villageId];
        else
          user.villages.push(villageId);
        this.afs.doc<User>(`users/${user.uid}`).update(user);
      })
    }

    async getUid() {
      let result:string;
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        result = user.uid;
      })
      return result;
    }

    /*async isAdmin() {
      let result:boolean;
      let user = this.user$.pipe(take(1)).toPromise();
      await user.then(user => {
        if (user == null)
          result = false;
        else
          result = user.role.admin;
      });
      return result;
    }*/
}
