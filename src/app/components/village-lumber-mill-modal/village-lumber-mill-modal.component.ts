import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Constants } from 'src/app/models/constants';

@Component({
  selector: 'app-village-lumber-mill-modal',
  templateUrl: './village-lumber-mill-modal.component.html',
  styleUrls: ['./village-lumber-mill-modal.component.sass']
})
export class VillageLumberMillModalComponent implements OnInit {
  @Input() villageId:string;
  village:Village;
  lumberMillURL:string;
  lumberCap:number;
  lumberPerHour:number;
  upgradeCostLumber:number;
  upgradeCostGold:number;
  upgradeTime:number;

  constructor(
    private villageService:VillageService,
    private storage:AngularFireStorage
  ) { }

  ngOnInit() {
    this.villageService.getVillage(this.villageId).subscribe(village => {
      this.village = village;
      this.lumberCap = Constants.calcCap("lm", village.lumberMillLv);
      this.lumberPerHour = Constants.calcGenPerHour("lm", village.lumberMillLv);
      this.upgradeCostGold = Constants.calcUpgradeCostGold("lm", village.lumberMillLv);
      this.upgradeCostLumber = Constants.calcUpgradeCostLumber("lm", village.lumberMillLv);
      this.upgradeTime = Constants.calcUpgradeTime("lm", village.lumberMillLv);
      this.storage.ref(`images/lumberMill${village.lumberMillLv}.png`).getDownloadURL().subscribe(url => this.lumberMillURL = url);
    })
  }
}
