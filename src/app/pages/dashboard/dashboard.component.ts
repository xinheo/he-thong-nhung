import { Component,OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SensorService } from 'src/app/services/sensor.service';
import { SystemService } from 'src/app/services/system.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy{
  isStartDrying = false

  timeDry:any = null
  tempDry:any = null
  sensorsValue: any = null
  progress = 0;
  timeCountDown = 0;
  isDisabledButtonStart = false
  countdownInterval: any;
  timeDisplay = ''
  system: any

  constructor(private systemService: SystemService,private sensorService: SensorService, private authService: AuthService) {

    this.systemService.getStatus().subscribe((value) => {
      console.log(value);
      this.system = value
      if (value?.[1]?.value) {
        this.isStartDrying = true;
        this.isDisabledButtonStart = true;
        this.timeCountDown = new Date(value[3]?.value).getTime();
      } else {
        this.isStartDrying = false;
        this.isDisabledButtonStart = false
      }

      this.startCountdown();
    });

    this.sensorService.getStatus().subscribe((value) => {
      console.log(value)
      this.sensorsValue = value
    })
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = this.timeCountDown - currentTime;

      if (timeDifference <= 0) {
        this.endDrySystem()
        clearInterval(this.countdownInterval);
      } else {
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        // Format the time display
        this.timeDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  startDrySystem() {
    console.log(this.timeDry, this.tempDry);
    if (!this.timeDry && !this.tempDry) {
      alert('Nhập nhiệt độ hoặc thời gian không đúng');
      return;
    }

      const time = new Date().getTime() + 1000*this.timeDry*60

      this.systemService.startSystem({ timeDry: time, tempDry: this.tempDry }).then(() => {
        this.isStartDrying = true;
      });
  }

  endDrySystem(){
    this.systemService.endSystem().then(() => {
      this.isStartDrying = false
    })
  }

  signOut(){
    this.authService.SignOut().then(() => {
      console.log("SIGN OUT")
    })
  }

}
