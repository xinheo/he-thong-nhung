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

  timeDry:any = 0
  tempDry:any = 0
  sensorsValue: any = null
  progress = 0;
  timeCountDown = 0;
  constructor(private systemService: SystemService,private sensorService: SensorService, private authService: AuthService) {

    this.systemService.getStatus().subscribe((value) => {
      console.log(value);
      if (value?.[1]?.value) {
        this.isStartDrying = true;
        this.timeCountDown = value[3]?.value;
      } else {
        this.isStartDrying = false;
      }
    });

    this.sensorService.getStatus().subscribe((value) => {
      console.log(value)
      this.sensorsValue = value
    })
  }

  startDrySystem() {
    console.log(this.timeDry, this.tempDry);
    if (!this.timeDry && !this.tempDry) {
      alert('Nhập nhiệt độ hoặc thời gian không đúng');
      return;
    }

      this.systemService.startSystem({ timeDry: this.timeDry, tempDry: this.tempDry }).then(() => {
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

  ngOnDestroy(): void {
  }
}
