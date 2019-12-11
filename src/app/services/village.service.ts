import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Village } from '../models/village.model';
import { take } from 'rxjs/operators';
import { Constants } from '../models/constants';
import { TaskService } from './task.service';

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

  upgradeBuilding (buildingType:string, currentBuildingLevel:number, villageId:string) {
    let villageRef = this.firestore.doc<Village>(`villages/${villageId}`);

    villageRef.valueChanges().pipe(take(1)).subscribe(village => {
      if(currentBuildingLevel < 3 && Constants.validateBuildingType(buildingType)) {
        let currentTime = Math.floor((Date.now()/1000)/60);
        let timestamp = (currentTime + Constants.calcUpgradeTime(buildingType, currentBuildingLevel))*1000*60;

        switch (buildingType) {
          case "gm" : village.goldMineUpgradeTime = timestamp; break;
          case "lm" : village.lumberMillUpgradeTime = timestamp; break;
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
}
