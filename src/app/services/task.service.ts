import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { timestamp } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private firestore:AngularFirestore
  ) { }

  createUpgradeBuildingTask(villageId:string, buildingType:string, completionTime:number, currentLevel:number) {
    this.firestore.doc(`tasks/${completionTime}/${buildingType}Upgrades/${villageId}`).set({
      id : villageId,
      type : buildingType,
      currentLevel : currentLevel,
      completionTime : completionTime,
      createdAt : Math.floor(Date.now()/1000)
    });
  }

  addUnitQueue(villageId:string, queue:number[]) {
    queue.forEach(timestamp => {
      this.firestore.doc(`tasks/${timestamp}/addUnits/${villageId}`).set({
        id: villageId,
        completionTime: timestamp,
        createdAt: Math.floor(Date.now()/1000)
      });
    });
  }
}
