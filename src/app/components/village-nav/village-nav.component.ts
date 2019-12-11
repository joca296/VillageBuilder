import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/models/constants';


@Component({
  selector: 'app-village-nav',
  templateUrl: './village-nav.component.html',
  styleUrls: ['./village-nav.component.sass']
})
export class VillageNavComponent implements OnInit {
  @Input() village:Village;
  gph = Constants.goldGenerationPerHour;
  gmum = Constants.goldMineUpgradeMulti;
  gcap = Constants.goldCap;

  lph = Constants.lumberGenerationPerHour;
  lmum = Constants.lumberMillUpgradeMulti;
  lcap = Constants.lumberCap;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  floor(number:number) {
    return Math.floor(number);
  }

}
