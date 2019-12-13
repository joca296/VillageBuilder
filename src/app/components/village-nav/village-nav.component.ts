import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { AttackingUnits } from 'src/app/models/attacking-units.model';
import { IncomingAttack } from 'src/app/models/incoming-attack.model';
import { ReturningUnits } from 'src/app/models/returning-units.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/models/constants';
import { VillageService } from 'src/app/services/village.service';

@Component({
  selector: 'app-village-nav',
  templateUrl: './village-nav.component.html',
  styleUrls: ['./village-nav.component.sass']
})
export class VillageNavComponent implements OnInit {
  @Input() villageId:string;
  village:Village;
  gph:number;
  gcap:number;

  lph:number;
  lcap:number;

  ucap:number;

  outAttacks:AttackingUnits[];
  incAttacks:IncomingAttack[];
  retUnits:ReturningUnits[];

  constructor(
    public auth: AuthService,
    private villageService:VillageService
  ) { }

  ngOnInit() {
    this.villageService.getVillage(this.villageId).subscribe(village => {
      this.village = village;
      this.gph = Constants.calcGenPerHour("gm",this.village.goldMineLv);
      this.gcap = Constants.calcCap("gm", this.village.goldMineLv);

      this.lph = Constants.calcGenPerHour("lm",this.village.lumberMillLv);
      this.lcap = Constants.calcCap("lm", this.village.lumberMillLv);

      this.ucap = Constants.calcCap('ba', this.village.barracksLv);

      this.villageService.getVillageIncomingAttacks(this.village.id).subscribe(docs => {
        this.incAttacks = docs;
      });
      this.villageService.getVillageOutgoingAttacks(this.village.id).subscribe(docs => {
        this.outAttacks = docs;
      });
      this.villageService.getVillageReturningUnits(this.village.id).subscribe(docs => {
        this.retUnits = docs;
      });
    });
  }

  toLocalTime(timestamp:number):string {
    let date = new Date(timestamp);
    return date.toLocaleString(`en-GB`);
  }
}
