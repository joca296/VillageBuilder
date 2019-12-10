import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { VillageService } from 'src/app/services/village.service';
import { Village } from 'src/app/models/village.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-nav',
  templateUrl: './game-nav.component.html',
  styleUrls: ['./game-nav.component.sass']
})
export class GameNavComponent implements OnInit {
  @Output() changedX = new EventEmitter();
  @Output() changedY = new EventEmitter();
  villages:Village[] = new Array;
  url:string;

  x = 0;
  y = 0;

  constructor(
    public auth: AuthService,
    private villageService: VillageService,
    private router:Router
    ) { }

  async ngOnInit() {
    this.url = this.router.url;
    this.auth.user$.subscribe(user => {
      user.villages.forEach(villageId => {
        this.villageService.getVillage(villageId).subscribe(village => {
          this.villages.push(village);
        })
      })
    })
  }

  onValueChangeX() {
    this.changedX.emit(this.x.toString());
  }

  onValueChangeY() {
    this.changedY.emit(this.y.toString());
  }

}
