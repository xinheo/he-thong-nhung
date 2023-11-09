import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = ''
  password: string = ''

  visiblePopup = false

  constructor(private authService: AuthService){}

  isValidEmail(s: string) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(s)
  }

  isValidPassword(s: string) {
    return s.split(" ").length === s.length && s.length > 6
  }

  signIn(){
    console.log(this.email, this.password,this.isValidEmail(this.email),this.isValidPassword(this.password))
    if(!this.isValidEmail(this.email) && !this.isValidPassword(this.password)){
      return
    }

    this.authService.signIn(this.email, this.password).then((value) => {
      if(value?.limitDevice){
        this.visiblePopup = true
      }
      console.log("SIGNIN",value)
    })
  }

  hidePopup(){
    this.visiblePopup = false
  }
}
