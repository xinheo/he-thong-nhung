import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { StatusService } from '../../app.service';
import { AuthService } from 'src/app/services/auth.service';

interface IStatus {
  isStart: boolean;
  time: number;
  isStop: boolean;
  turnOnLed: boolean;
  turnOnMachine: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  statusId: string  = ""
  private dbPath = '/status';

  isTurnOnLed = false

  // value: IStatus = {
  //   turnOnLed: false,
  //   turnOnMachine: false,
  //   isStart: false,
  //   isStop: false,
  //   time: 213123
  // }

  ledRef!: AngularFireList<any>
  constructor(private db: AngularFireDatabase, private statusService: StatusService, private authService: AuthService) {
    // this.ledRef = db.list(this.dbPath);
    // this.ledRef.snapshotChanges().subscribe((value) => {
    //   console.log(value)
    // })
    this.statusService.getStatus().subscribe((value) => {
      console.log(value)
      this.statusId = value[0].key
    })
  }

  onClick(){

    const status: IStatus  = {
      isStart: false,
      isStop: false,
      turnOnLed: false,
      turnOnMachine: false,
      time: 10000000
    }

    // this.ledRef.push(status).then((value) => {
    //   console.log("OK",value)
    // })
  }
  onToggle(){
    // const statusUpdated: IStatus = {...this.value, turnOnLed: this.isTurnOnLed}

    const ledValue = this.isTurnOnLed ? 1 : 0

      this.statusService.updateStatus('led', ledValue).then(() => {
        console.log("Updated")
      })
    console.log(this.statusId)

  }

  signOut(){
    this.authService.SignOut().then(() => {
      console.log("SIGN OUT")
    })
  }
}
