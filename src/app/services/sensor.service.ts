
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class SensorService {

  sensor!:  AngularFireList<any>;
  constructor( private db: AngularFireDatabase){
    this.sensor = this.db.list('sensor');
  }

  getStatus(): Observable<any> {
    return this.sensor.snapshotChanges().pipe(
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
  updateSensors(object: Record<string,boolean> ){
    return this.db.object('sensor').update(object)
  }

  updateSensor(key: string, value: any){
    const object: Record<string,any> = {}
    object[key] = value
    return this.db.object('sensor').update(object)
  }
}
