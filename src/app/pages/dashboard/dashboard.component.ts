import { AfterViewInit, Component,ElementRef,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SensorService } from 'src/app/services/sensor.service';
import { SystemService } from 'src/app/services/system.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, AfterViewInit{
  @ViewChild('audioFire') audioFire!: ElementRef
  @ViewChild('content') contentEl!: ElementRef
  isStartDrying = false

  timeDry:any = null
  tempDry:any = null
  sensorsValue: any = null
  progress = 0;
  timeCountDown = 0;
  isDisabledButtonStart = false
  countdownInterval: any;
  timeDisplay = '0'
  system: any
  timeDryDisplay = 0

  visiblePopupConfirm =  false
  visiblePopupFire = false
  visiblePopupSignOut= false

  constructor(private systemService: SystemService,private sensorService: SensorService, private authService: AuthService, private router: Router) {

    this.systemService.getStatus().subscribe((value) => {

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
      console.log("dsadsadasd",value)
      this.sensorsValue = value

      if(value?.[6]?.value){
        this.visiblePopupFire = true
        this.audioFire.nativeElement.play()
        this.endDrySystem()
      }
    })
  }


  ngAfterViewInit(): void {
    // console.log("ASD", this.audioFire.nativeElement)
    // this.audioFire.nativeElement.play()
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = this.timeCountDown - currentTime;
      if (timeDifference <= 0) {
        if(this.system?.[0]?.value){
          this.endDrySystem()
        }
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

  changeDryDevice(value: any){
    console.log("changeDryDevice",this.sensorsValue)
    this.sensorService.updateSensor('dryDevice',value).then()
  }

  changeFanDevice(value: any){
    console.log("changeFanDevice",this.sensorsValue)
    this.sensorService.updateSensor('fanDevice',value).then()
  }

  changeIsAutoSystem(value:any){
    console.log("value",value)
    this.systemService.updateIsAuto(value).then()
  }

  startDrySystem() {
    // console.log(this.timeDry, this.tempDry);
    if (!this.timeDry || !this.tempDry) {
      alert('Nhập nhiệt độ hoặc thời gian không đúng!');
      return;
    }
    this.timeDryDisplay = this.timeDry

      const time = new Date().getTime() + 1000*this.timeDry*60

      this.systemService.startSystem({ timeDry: time, tempDry: this.tempDry }).then(() => {
        this.isStartDrying = true;
        this.tempDry = 0;
        this.timeDry = 0;
        this.contentEl?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' })
      });
  }

  endDrySystem(){
    this.timeDryDisplay = 0

    this.systemService.endSystem().then(() => {
      const data: Record<string,boolean> = {
        fanDevice: false,
        dryDevice:false,
        warningFlame: false
      }
      this.sensorService.updateSensors(data)
      this.isStartDrying = false
    })
  }

  signOut(){
    this.authService.SignOut().then(() => {
      console.log("SIGN OUT")
    })
  }


  hidePopup(){
    this.visiblePopupConfirm = false
  }

  showPopup(){
    this.visiblePopupConfirm = true
  }
  hidePopupFire() {
    this.visiblePopupFire = false
    this.audioFire.nativeElement.pause()
  }

  hidePopupSignOut(){
    this.visiblePopupSignOut = false
  }

  showPopupSignOut(){
    this.visiblePopupSignOut = true
  }
}
