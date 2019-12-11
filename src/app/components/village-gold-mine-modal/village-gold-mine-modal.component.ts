import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Constants } from 'src/app/models/constants';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-village-gold-mine-modal',
  templateUrl: './village-gold-mine-modal.component.html',
  styleUrls: ['./village-gold-mine-modal.component.sass']
})
export class VillageGoldMineModalComponent implements OnInit {
  @Input() villageId:string;
  village:Village;
  goldMineURL:string;
  goldCap:number;
  goldPerHour:number;
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
      this.goldCap = Constants.calcCap("gm", village.goldMineLv);
      this.goldPerHour = Constants.calcGenPerHour("gm", village.goldMineLv);
      this.upgradeCostGold = Constants.calcUpgradeCostGold("gm", village.goldMineLv);
      this.upgradeCostLumber = Constants.calcUpgradeCostLumber("gm", village.goldMineLv);
      this.upgradeTime = Constants.calcUpgradeTime("gm", village.goldMineLv);

      this.currentlyUpgrading = !isNullOrUndefined(this.village.goldMineUpgradeTime);
      this.hasMaterials = village.gold >= this.upgradeCostGold && village.lumber >= this.upgradeCostLumber;
      this.upgradePossible = this.village.goldMineLv != 3 && !this.currentlyUpgrading && this.hasMaterials;
      this.remainingTime = this.currentlyUpgrading ? new Date(this.village.goldMineUpgradeTime) : null;
      this.remainingTime = !isNullOrUndefined(this.remainingTime) ? this.remainingTime.toLocaleString(`en-GB`) : null;

      this.storage.ref(`images/goldMine${village.goldMineLv}.png`).getDownloadURL().subscribe(url => this.goldMineURL = url);
    })
  }

  upgrade() {
    this.villageService.upgradeBuilding('gm', this.village.goldMineLv, this.village.id);
  }

}
