import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { AttackService } from 'src/app/services/attack.service';

@Component({
  selector: 'app-game-village-modal',
  templateUrl: './game-village-modal.component.html',
  styleUrls: ['./game-village-modal.component.sass']
})
export class GameVillageModalComponent implements OnInit {
  @Input() villageId:string;
  village:Village;
  ownedVillages:Village[] = new Array();
  isVillageOwner:boolean;
  villageOwner:string;

  selectedVillage:string = "0";
  numberOfUnits:number;

  constructor(
    private villageService: VillageService,
    private firestore: AngularFirestore,
    private attackService: AttackService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.villageService.getVillage(this.villageId).subscribe(async village => {
      this.village = village;
      this.isVillageOwner = await this.auth.isVillageOwner(village.id);
      this.firestore.doc<User>(`users/${village.owner}`).valueChanges().subscribe(user => {
        this.villageOwner = user.displayName;
      })
    })
    this.auth.user$.subscribe(user => {
      user.villages.forEach(villageId => {
        this.villageService.getVillage(villageId).subscribe(village => {
          this.ownedVillages.push(village);
        })
      })
    })
  }

  startAttack() {
    if (this.numberOfUnits < this.village.units)
      alert ("Not enough units for attack.");
    else
      this.attackService.createAttack(this.selectedVillage,this.village.id,this.numberOfUnits);
  }
}
