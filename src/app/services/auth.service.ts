
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user: any
  constructor( private authFirebase: AngularFireAuth, private router: Router){

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
    console.log("AA")
    return this.authFirebase
      .signInWithEmailAndPassword(email, password).then((result) =>{
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
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
