import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Constants } from 'src/app/models/constants';
import { isNullOrUndefined } from 'util';
import { Alert } from 'src/app/models/alert.model';

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

  alert:Alert;

  constructor(
    private villageService:VillageService,
    private storage:AngularFireStorage
  ) { }

  ngOnInit() {
    this.alert = new Alert();
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

      this.storage.ref(`images/barracks${village.barracksLv}.png`).getDownloadURL().subscribe(url => this.barracksURL = url);
    })
  }

  upgrade() {
    this.villageService.upgradeBuilding('ba', this.village.barracksLv, this.village.id);
    this.alert.setType("success");
    this.alert.addMessage("Building is upgrading");
  }

  onClose() {
    this.alert.clearMessages();
  }

  async createUnits() {
    let isOk:boolean = true;
    this.alert.clearMessages();

    if (isNullOrUndefined(this.unitsToProduce) || this.unitsToProduce <= 0) {
      isOk = false;
      this.alert.setType('danger');
      this.alert.addMessage('Please enter a number above zero.');
    }
    else {
      //manage for cap
      let totalUnits = this.village.units;
      totalUnits += await this.villageService.getNumberOfAttackingUnits(this.village.id);
      totalUnits += await this.villageService.getNumberOfReturningUnits(this.village.id);
      totalUnits += this.village.unitQueue.length;

      let unitCap = Constants.calcCap('ba', this.village.barracksLv);

      if (this.unitsToProduce + totalUnits > unitCap) {
        isOk = false;
        this.unitsToProduce = unitCap - totalUnits;
        this.alert.setType('danger');
        this.alert.addMessage('Unit cap reached.');
      }

      //manage for resources
      let totalCost = this.unitsToProduce * Constants.unitCostGold;
      if (totalCost > this.village.gold) {
        isOk = false;
        this.unitsToProduce = Math.floor(this.village.gold/Constants.unitCostGold);
        this.alert.setType('danger');
        this.alert.addMessage('Not enough gold.');
      }

      if (isOk) {
        this.villageService.addUnits(this.unitsToProduce, this.village.id);
        this.alert.setType('success');
        this.alert.addMessage('Queue added.');
      }
      else {
        this.alert.addMessage(`${this.unitsToProduce} unit(s) is possible to create at this time.`);
      }
    }
  }
}
