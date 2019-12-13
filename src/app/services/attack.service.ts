import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TaskService } from './task.service';
import { Village } from '../models/village.model';
import { VillageService } from './village.service';
import { Constants } from '../models/constants';
import { AttackingUnits } from '../models/attacking-units.model';
import { IncomingAttack } from '../models/incoming-attack.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AttackService {

  constructor(
    private firestore: AngularFirestore,
    private taskService: TaskService,
    private villageService: VillageService
  ) { }

  createAttack(src:string, dest:string, numberOfUnits:number) {
    this.villageService.getVillage(src).pipe(take(1)).subscribe(srcVillage => {
      this.villageService.getVillage(dest).pipe(take(1)).subscribe(destVillage => {
        let dist = this.calcDistance(srcVillage.x,srcVillage.y,destVillage.x,destVillage.y);
        let currentTime = Math.floor((Date.now()/1000)/60);
        let timeOfTravel = Constants.unitMoveSpeed * dist;
        let timeOfArrival = (currentTime + timeOfTravel)*1000*60;

        this.firestore.doc<AttackingUnits>(`villages/${srcVillage.id}/attackingUnits/${destVillage.id}`).set({
          destination: destVillage.id,
          destinationName: destVillage.name,
          numberOfUnits: numberOfUnits,
          timeOfAttack: timeOfArrival
        });

        this.firestore.doc<IncomingAttack>(`villages/${destVillage.id}/incomingAttacks/${srcVillage.id}`).set({
          source: srcVillage.id,
          sourceName: srcVillage.name,
          numberOfUnits: numberOfUnits,
          timeOfAttack: timeOfArrival
        });

        srcVillage.units -= numberOfUnits;
        this.firestore.doc<Village>(`villages/${srcVillage.id}`).set(srcVillage, {merge:true});

        this.taskService.createAttack(src,dest,numberOfUnits,timeOfArrival,dist);

        alert("Attack started");
      })
    })
  }

  calcDistance(srcX:number, srcY:number, destX:number, destY:number):number {
    let a = Math.abs(srcX-destX);
    let b = Math.abs(srcY-destY);
    let cSq = Math.pow(a, 2) + Math.pow(b, 2);
    let c = Math.sqrt(cSq);
    return Math.floor(c);
  }
}
