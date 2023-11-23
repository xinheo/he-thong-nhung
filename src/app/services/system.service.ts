
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class SystemService {

  system!:  AngularFireList<any>;
  constructor( private db: AngularFireDatabase){
    this.system = this.db.list('system');
  }

  getStatus(): Observable<any> {
    return this.system.snapshotChanges().pipe(
      map((changes:any) => {
        return  changes.map((c:any) => {
          const key = c.payload.key;
          const value = c.payload.val();
          return {key,value}
        }
      )
      }
      )
    );
  }

  startSystem(data: {
    timeDry: number,
    tempDry: number
  }){
    return this.db.object('system').update({isStart: true,...data})
  }

  endSystem(){
    return this.db.object('system').update({isStart: false,timeDry: 0, tempDry: 0})
  }

  updateTimeDry(time:any){
    return this.db.object('system').update({timeDry: time})
  }

  updateIsAuto(isAuto:any){
    return this.db.object('system').update({isAuto: isAuto})
  }
}
