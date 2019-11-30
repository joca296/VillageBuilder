import { Component, OnInit } from '@angular/core';
import { VillageService } from 'src/app/services/village.service';
import { Village } from 'src/app/models/village.model';
import { Constants } from 'src/app/models/constants';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  map:Village[][] = new Array;
  url:string;
  terrainURL:string;
  villageOnMapURL:string;
  cellSize:number = 96;

  constructor(
    private villageService: VillageService,
    private storage: AngularFireStorage,
    private router: Router
  ) { }

  ngOnInit() {
    this.storage.ref('images/terrain.jpg').getDownloadURL().subscribe(url => this.terrainURL = url);
    this.storage.ref('images/villageOnMap.png').getDownloadURL().subscribe(url => this.villageOnMapURL = url);
    this.url = this.router.url;

    this.villageService.getVillages().subscribe(villages => {
      let villageCount:number = villages.length;
      let currentVillage:number = 0;

      for (let i = 0; i < Constants.x; i++) {
        this.map[i] = [];
        for (let j = 0; j < Constants.y; j++) {

          if(currentVillage < villageCount && villages[currentVillage].x == i && villages[currentVillage].y == j) {
            this.map[i][j] = villages[currentVillage];
            currentVillage ++;
          }
          else {
            this.map[i][j] = null;
          }

        }
      }

    })
  }

  zoomIn() {
    if(this.cellSize - 12 < 144)
      this.cellSize += 12;
  }

  zoomOut() {
    if(this.cellSize - 12 > 24)
      this.cellSize -= 12;
  }
}
