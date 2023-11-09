
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user: any
  authDevice!:  AngularFireList<any>;
  limitDevice: number = 0
  constructor( private authFirebase: AngularFireAuth, private router: Router, private db: AngularFireDatabase){

    this.authDevice = this.db.list('auth');

    this.authDevice.valueChanges().subscribe((value) => {
      this.limitDevice = value[0]
    })

    this.authFirebase.authState.subscribe((result) => {
      if (result) {
        this.user = result;
        localStorage.setItem('user', JSON.stringify(this.user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(email: string, password: string){

    if(this.limitDevice === 1){
      return Promise.resolve({limitDevice:this.limitDevice})
    }

    return this.authFirebase
      .signInWithEmailAndPassword(email, password).then((result) =>{

        this.db.object('auth').update({device: 1})
        this.user = result
        console.log(result)
        this.authFirebase.authState.subscribe((user) => {

          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null
  }

  SignOut() {
    return this.authFirebase.signOut().then(() => {

      this.db.object('auth').update({device: 0})
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
