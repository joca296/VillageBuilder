import { Component, OnInit, Input } from '@angular/core';
import { Village } from 'src/app/models/village.model';
import { VillageService } from 'src/app/services/village.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { AttackService } from 'src/app/services/attack.service';
import { Alert } from 'src/app/models/alert.model';

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

  alert:Alert;

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
          this.ownedVillages = new Array();
          this.ownedVillages.push(village);
        })
      })
    })
    this.alert = new Alert();
  }

  async startAttack() {
    if (this.selectedVillage == "0") {
      this.alert.clearMessages();
      this.alert.setType('danger');
      this.alert.addMessage('Select a village');
    }
    else if (this.numberOfUnits > await this.villageService.getVillageUnitNumber(this.selectedVillage)){
      this.alert.clearMessages();
      this.alert.setType('danger');
      this.alert.addMessage('Not eough units for attack');
    }
    else if (await this.attackService.isAlreadyAttacking( this.selectedVillage, this.village.id)) {
      this.alert.clearMessages();
      this.alert.setType('danger');
      this.alert.addMessage('You are already attacking this village');
    }
    else {
      this.alert.clearMessages();
      this.attackService.createAttack(this.selectedVillage,this.village.id,this.numberOfUnits);
      this.alert.setType('success');
      this.alert.addMessage('Attack started');
    }
  }
}
