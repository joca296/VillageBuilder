import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Constants } from 'src/app/models/constants';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-village-barracks-modal',
  templateUrl: './village-barracks-modal.component.html',
  styleUrls: ['./village-barracks-modal.component.sass']
})
export class VillageBarracksModalComponent implements OnInit {
  @Input() villageId:string;
  village:Village;
  barracksURL:string;

  unitGenerationSpeed:number;
  unitCap:number;
  unitSpeed:number;
  unitCost:number;

  unitsToProduce:number;

  upgradeCostLumber:number;
  upgradeCostGold:number;
  upgradeTime:number;

  upgradePossible:boolean = false;
  currentlyUpgrading:boolean = false;
  hasMaterials:boolean = false;
  remainingTime;

  constructor(
    private villageService:VillageService,
    private storage:AngularFireStorage
  ) { }

  ngOnInit() {
    this.villageService.getVillage(this.villageId).subscribe(village => {
      this.village = village;

      this.upgradeCostGold = Constants.calcUpgradeCostGold("ba", village.barracksLv);
      this.upgradeCostLumber = Constants.calcUpgradeCostLumber("ba", village.barracksLv);
      this.upgradeTime = Constants.calcUpgradeTime("ba", village.barracksLv);

      this.unitGenerationSpeed = Constants.calcUnitGeneration(village.barracksLv);
      this.unitCap = Constants.calcCap("ba", village.barracksLv);
      this.unitSpeed = Constants.unitMoveSpeed;
      this.unitCost = Constants.unitCostGold;

      this.currentlyUpgrading = !isNullOrUndefined(this.village.barracksUpgradeTime);
      this.hasMaterials = village.gold >= this.upgradeCostGold && village.lumber >= this.upgradeCostLumber;
      this.upgradePossible = this.village.barracksLv != 3 && !this.currentlyUpgrading && this.hasMaterials;
      this.remainingTime = this.currentlyUpgrading ? new Date(this.village.barracksUpgradeTime) : null;
      this.remainingTime = !isNullOrUndefined(this.remainingTime) ? this.remainingTime.toLocaleString(`en-GB`) : null;

      this.storage.ref(`images/barracks${village.barracksLv}.png`).getDownloadURL().subscribe(url => this.barracksURL = url);
    })
  }

  upgrade() {
    this.villageService.upgradeBuilding('ba', this.village.barracksLv, this.village.id);
  }

  createUnits() {
    this.villageService.addUnits(this.unitsToProduce, this.village.id);
  }
}
