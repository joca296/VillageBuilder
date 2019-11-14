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
  goldMineURL:string;
  barracksURL:string;
  storageURL:string;

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
    });
  }

}
