import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
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
    });
  }
}
