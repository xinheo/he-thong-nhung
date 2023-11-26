import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  popupText = 'Hệ thống đang được người khác sử dụng'

  constructor(private authService: AuthService,private router: Router){
    if(this.authService.isLoggedIn){
      this.router.navigate(['dashboard'])
    }
  }

  isValidEmail(s: string) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(s)
  }

  isValidPassword(s: string) {
    return s.split(" ").length === s.length && s.length > 6
  }

  signIn(){
    if(!this.isValidEmail(this.email) && !this.isValidPassword(this.password)){
      this.popupText = "Tên đăng nhập hoặc mật khẩu sai"
      this.visiblePopup = true
      return
    }

    this.authService.signIn(this.email, this.password).then((value) => {
      if(value?.limitDevice){
        this.visiblePopup = true
      }
    })
  }

  hidePopup(){
    this.popupText = 'Hệ thống đang được người khác sử dụng'
    this.visiblePopup = false
  }
}
