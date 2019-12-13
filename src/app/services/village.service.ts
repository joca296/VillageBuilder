import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Village } from '../models/village.model';
import { take } from 'rxjs/operators';
import { Constants } from '../models/constants';
import { TaskService } from './task.service';
import { isNullOrUndefined } from 'util';
import { AttackingUnits } from '../models/attacking-units.model';
import { ReturningUnits } from '../models/returning-units.model';
import { IncomingAttack } from '../models/incoming-attack.model';

@Injectable({
  providedIn: 'root'
})
export class VillageService {

  constructor (
    private firestore:AngularFirestore,
    private storage:AngularFireStorage,
    private taskService:TaskService,
    private auth:AuthService,
    private router: Router) { }

  async createVillage(villageName:string, x:number, y:number) {
    let newVillage:Village = {
      id : Math.random().toString(36).replace('0.', ''),
      x : x,
      y : y,
      name : villageName,
      owner : await this.auth.getUid(),
      barracksLv : 1,
      lumberMillLv : 1,
      goldMineLv : 1,
      units: 0,
      gold: 100,
      lumber: 200
    }

    const villageRef = this.firestore.doc<Village>(`villages/${newVillage.id}`);

    villageRef.set(newVillage);

    await this.auth.addVillage(newVillage.id);
    alert("Village Created");
    this.router.navigate(['game']);
  }

  async validateLocation(x:number, y:number) {
    let result:boolean = true;
    const villages = this.firestore.collection<Village>(`villages`).valueChanges().pipe(take(1)).toPromise();

    await villages.then(villages=> {
      villages.forEach(village => {
        if (village.x == x && village.y == y)
          result = false;
      });
    });

    return result;
  }

  async validateVillageName(villageName:string) {
    let result:boolean = true;
    const villages = this.firestore.collection<Village>(`villages`).valueChanges().pipe(take(1)).toPromise();

    await villages.then(villages=> {
      villages.forEach(village => {
        if (village.name.trim().toLowerCase().localeCompare(villageName.trim().toLowerCase()) == 0)
          result = false;
      });
    });

    return result;
  }

  getVillages () {
    return this.firestore.collection<Village>('villages', ref => ref.orderBy('x','asc').orderBy('y','asc')).valueChanges();
  }

  getVillage (villageId:string) {
    return this.firestore.doc<Village>(`villages/${villageId}`).valueChanges();
  }

  getVillageIncomingAttacks (villageId:string) {
    return this.firestore.collection<IncomingAttack>(`villages/${villageId}/incomingAttacks`).valueChanges();
  }

  getVillageOutgoingAttacks (villageId:string) {
    return this.firestore.collection<AttackingUnits>(`villages/${villageId}/attackingUnits`).valueChanges();
  }

  getVillageReturningUnits (villageId:string) {
    return this.firestore.collection<ReturningUnits>(`villages/${villageId}/returningUnits`).valueChanges();
  }

  upgradeBuilding (buildingType:string, currentBuildingLevel:number, villageId:string) {
    let villageRef = this.firestore.doc<Village>(`villages/${villageId}`);

    villageRef.valueChanges().pipe(take(1)).subscribe(village => {
      if(currentBuildingLevel < 3 && Constants.validateBuildingType(buildingType)) {
        let currentTime = Math.floor((Date.now()/1000)/60);
        let timestamp = (currentTime + Constants.calcUpgradeTime(buildingType, currentBuildingLevel))*1000*60;

        switch (buildingType) {
          case "gm" : village.goldMineUpgradeTime = timestamp; break;
          case "lm" : village.lumberMillUpgradeTime = timestamp; break;
          case "ba" : village.barracksUpgradeTime = timestamp; break;
        }

        village.gold -= Constants.calcUpgradeCostGold(buildingType, currentBuildingLevel);
        village.lumber -= Constants.calcUpgradeCostLumber(buildingType, currentBuildingLevel);

        villageRef.set(village, {merge : true});
        this.taskService.createUpgradeBuildingTask(villageId,buildingType,timestamp,currentBuildingLevel);

        alert("Building is upgrading");
      }
      else if (currentBuildingLevel >= 3)
        alert("Invalid call of the upgradeBuilding function. Building should be at max level.");
      else
        alert("Invalid building type string.");
    });
  }

  async addUnits (numberOfUnits:number, villageId:string) {
    let villageRef = this.firestore.doc<Village>(`villages/${villageId}`);

    villageRef.valueChanges().pipe(take(1)).subscribe(async village => {
      let unitGenerationSpeed = Constants.calcUnitGeneration(village.barracksLv)*1000*60;

      let currentTime = Math.floor((Date.now()/1000)/60)*1000*60;

      if (isNullOrUndefined(village.unitQueue) || village.unitQueue.length == 0)
        village.unitQueue = new Array<number>();
      else {
        let lastElement = village.unitQueue.length - 1;
        currentTime = village.unitQueue[lastElement];
      }

      //manage for cap
      let totalUnits = village.units;
      totalUnits += await this.getNumberOfAttackingUnits(village.id);
      totalUnits += await this.getNumberOfReturningUnits(village.id);
      totalUnits += village.unitQueue.length;

      let unitCap = Constants.calcCap('ba',village.barracksLv);

      if (numberOfUnits + totalUnits > unitCap) {
        numberOfUnits = unitCap - totalUnits;
        alert(`Unit cap reached, you can create ${numberOfUnits} at this time`);
      }

      //manage for resources
      let totalCost = 0;
      if  (numberOfUnits != 0) {
        totalCost = numberOfUnits * Constants.unitCostGold;
        if (totalCost > village.gold) {
          numberOfUnits = Math.floor(village.gold/Constants.unitCostGold);
          alert(`Not enough gold, you can create ${numberOfUnits} at this time`);
        }
      }

      if (numberOfUnits != 0) {
        let newQueue:number[] = new Array<number>();
        for (let i=0; i<numberOfUnits; i++) {
          currentTime += unitGenerationSpeed;
          newQueue.push(currentTime);
          village.unitQueue.push(currentTime);
          village.gold -= Constants.unitCostGold;
        }
        villageRef.set(village, {merge : true});
        this.taskService.addUnitQueue(village.id, newQueue);
        alert("Queue added.");
      }

    })
  }

  async getNumberOfAttackingUnits (villageId:string) {
    let attackingUnitsRef = this.firestore.collection<AttackingUnits>(`villages/${villageId}/attackingUnits`).valueChanges().pipe(take(1)).toPromise();
    let numberOfUnits:number = 0;

    await attackingUnitsRef.then(attackingUnits => {
      attackingUnits.forEach(doc => {
        numberOfUnits += doc.numberOfUnits;
      })
    });

    return numberOfUnits;
  }

  async getNumberOfReturningUnits (villageId:string) {
    let returningUnitsRef = this.firestore.collection<ReturningUnits>(`villages/${villageId}/returningUnits`).valueChanges().pipe(take(1)).toPromise();
    let numberOfUnits:number = 0;

    await returningUnitsRef.then(returningUnits => {
      returningUnits.forEach(doc => {
        numberOfUnits += doc.numberOfUnits;
      })
    });

    return numberOfUnits;
  }
}
