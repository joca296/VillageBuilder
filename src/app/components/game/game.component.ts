import { Component, OnInit } from '@angular/core';
import { VillageService } from 'src/app/services/village.service';
import { Village } from 'src/app/models/village.model';
import { Constants } from 'src/app/models/constants';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  zoom:number;

  rulerX:number[];
  rulerY:number[];

  url:string;
  terrainURL:string;
  villageOnMap1URL:string;
  villageOnMap2URL:string;
  villageOnMap3URL:string;
  mapBackgroundURL:string;
  bigMapURL:string;

  constructor(
    private villageService: VillageService,
    private storage: AngularFireStorage,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.storage.ref('images/terrain.jpg').getDownloadURL().subscribe(url => this.terrainURL = url);
    this.storage.ref('images/villageOnMap1.png').getDownloadURL().subscribe(url => this.villageOnMap1URL = url);
    this.storage.ref('images/villageOnMap2.png').getDownloadURL().subscribe(url => this.villageOnMap2URL = url);
    this.storage.ref('images/villageOnMap3.png').getDownloadURL().subscribe(url => this.villageOnMap3URL = url);
    this.storage.ref('images/map-background.jpg').getDownloadURL().subscribe(url => this.mapBackgroundURL = url);
    this.storage.ref('images/bigMap.png').getDownloadURL().subscribe(url => this.bigMapURL = url);
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
    });

    //centering first village on the map
    this.auth.user$.subscribe(user => {
      this.villageService.getVillage(user.villages[0]).pipe(take(1)).subscribe(village => {
        this.startX = village.x - Math.floor(this.resolution/2);
        if (this.startX < 0)
          this.startX = 0;
        else if (this.startX + this.resolution + Math.floor(this.resolution/2) > Constants.x)
          this.startX = Constants.x - this.resolution;

        this.startY = village.y - Math.floor(this.resolution/2);
        if (this.startY < 0)
          this.startY = 0;
        else if (this.startY + this.resolution + Math.floor(this.resolution/2) > Constants.x)
          this.startY = Constants.x - this.resolution;

        this.onMapDisplayChange();
      });
    });

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
    this.zoom = Constants.x / this.resolution;
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
    if (this.resolution + this.startX > Constants.x)
      this.startX = Constants.x - this.resolution;
    if (this.resolution + this.startY > Constants.y)
      this.startY = Constants.y - this.resolution;
    this.onMapDisplayChange();
  }

  zoomOut() {
    if (this.resolution + 1 <= 25)
      this.resolution++;
    if (this.resolution + this.startX > Constants.x)
      this.startX = Constants.x - this.resolution;
    if (this.resolution + this.startY > Constants.y)
      this.startY = Constants.y - this.resolution;
    this.onMapDisplayChange();
  }

  movePositiveX() {
    this.startX + 2*this.resolution < Constants.x ? this.startX += this.resolution : this.startX = Constants.x - this.resolution;
    this.onMapDisplayChange();
  }

  moveNegativeX() {
    this.startX - this.resolution > 0 ? this.startX -= this.resolution : this.startX = 0;
    this.onMapDisplayChange();
  }

  movePositiveY() {
    this.startY + 2*this.resolution < Constants.y ? this.startY += this.resolution : this.startY = Constants.y - this.resolution;
    this.onMapDisplayChange();
  }

  moveNegativeY() {
    this.startY - this.resolution > 0 ? this.startY -= this.resolution : this.startY = 0;
    this.onMapDisplayChange();
  }

  loadBackground(village:Village) {
    let avg = this.villageService.averageLevel(village);
    switch (avg) {
      case 1 : return this.villageOnMap1URL; break;
      case 2 : return this.villageOnMap2URL; break;
      case 3 : return this.villageOnMap3URL; break;
    }
  }
}
