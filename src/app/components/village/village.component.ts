import { Component, OnInit } from '@angular/core';
import { VillageService } from 'src/app/services/village.service';
import { Village } from 'src/app/models/village.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  styleUrls: ['./village.component.sass']
})
export class VillageComponent implements OnInit {
  village:Village;
  villageId:string;
  villageBackgroundURL:string;
  goldMineURL:string;
  barracksURL:string;
  lumberMillURL:string;
  mapBackgroundURL:string;

  constructor(
    private route: ActivatedRoute,
    private villageService:VillageService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap (params =>
        this.villageService.getVillage(params.get('id'))
      )
    ).subscribe(village => {
      this.village = village;
      this.storage.ref(`images/barracks${village.barracksLv}.png`).getDownloadURL().subscribe(url => this.barracksURL = url);
      this.storage.ref(`images/goldMine${village.goldMineLv}.png`).getDownloadURL().subscribe(url => this.goldMineURL = url);
      this.storage.ref(`images/lumberMill${village.lumberMillLv}.png`).getDownloadURL().subscribe(url => this.lumberMillURL = url);
      this.storage.ref(`images/villageBackground.png`).getDownloadURL().subscribe(url => this.villageBackgroundURL = url);
      this.storage.ref('images/map-background.jpg').getDownloadURL().subscribe(url => this.mapBackgroundURL = url);
    });
  }

}
