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
  fullMmap:Village[][] = new Array;

  map:Village[][];
  startX:number = 0;
  startY:number = 0;
  resolution:number = 10;

  rulerX:number[];
  rulerY:number[];

  url:string;
  terrainURL:string;
  villageOnMapURL:string;

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
        this.fullMmap[i] = [];
        for (let j = 0; j < Constants.y; j++) {

          if(currentVillage < villageCount && villages[currentVillage].x == i && villages[currentVillage].y == j) {
            this.fullMmap[i][j] = villages[currentVillage];
            currentVillage ++;
          }
          else {
            this.fullMmap[i][j] = null;
          }

        }
      }

      this.onMapDisplayChange();
    })
  }

  onNavValueChangeX(x) {
    x = parseInt(x);
    if (x < 0)
      this.startX = 0;
    else if (x > Constants.x - this.resolution)
      this.startX = Constants.x - this.resolution;
    else
      this.startX = x;
    this.onMapDisplayChange();
  }

  onNavValueChangeY(y) {
    y = parseInt(y);
    if (y < 0)
      this.startY = 0;
    else if (y > Constants.y - this.resolution)
      this.startY = Constants.y - this.resolution;
    else
      this.startY = y;
    this.onMapDisplayChange();
  }

  onMapDisplayChange() {
    let x:number = this.startX;
    let y:number = this.startY;
    console.log(x,y);

    this.map = new Array;
    this.rulerX = new Array;
    this.rulerY = new Array;
    for (let i=0; i < this.resolution; i++) {
      this.map[i] = [];
      for (let j=0; j < this.resolution; j++) {
        this.map[i][j] = this.fullMmap[x][y];
        y++;
      }
      x++;
      y = this.startY;
      this.rulerX[i] = this.startX + i;
      this.rulerY[i] = this.startY + i;
    }

  }

  zoomIn() {
    if (this.resolution - 1 >= 5)
      this.resolution--;
    this.onMapDisplayChange();
  }

  zoomOut() {
    if (this.resolution + 1 <= 25)
      this.resolution++;
    this.onMapDisplayChange();
  }

  movePositiveX() {
    this.startX + this.resolution <= Constants.x ? this.startX += this.resolution : this.startX = Constants.x;
    this.onMapDisplayChange();
  }

  moveNegativeX() {
    this.startX - this.resolution >= 0 ? this.startX -= this.resolution : this.startX = 0;
    this.onMapDisplayChange();
  }

  movePositiveY() {
    this.startY + this.resolution <= Constants.y ? this.startY += this.resolution : this.startY = Constants.y;
    this.onMapDisplayChange();
  }

  moveNegativeY() {
    this.startY - this.resolution >= 0 ? this.startY -= this.resolution : this.startY = 0;
    this.onMapDisplayChange();
  }
}
