import { Component, OnInit } from '@angular/core';
import { VillageService } from 'src/app/services/village.service';
import { Alert } from 'src/app/models/alert.model';

@Component({
  selector: 'app-create-village',
  templateUrl: './create-village.component.html',
  styleUrls: ['./create-village.component.sass']
})
export class CreateVillageComponent implements OnInit {
  villageName:string = "";
  locationPreference:string = "0";
  alert:Alert;

  constructor(
    private villageService:VillageService
  ) { }

  ngOnInit() {
    this.alert = new Alert();
  }

  async onSubmit() {
    let x:number;
    let y:number;

    //village name validation
    if (this.villageName == "") {
      this.alert.setType("danger");
      this.alert.clearMessages();
      this.alert.addMessage("Village name field must not be empty.");
    }
    else if (!await this.villageService.validateVillageName(this.villageName)) {
      this.alert.setType("danger");
      this.alert.clearMessages();
      this.alert.addMessage("Village name must be unique.");
    }
    else {
      //determine village location
      do {
        switch (this.locationPreference) {
          case "0" :
            x = Math.floor(Math.random()*100);//0-99
            y = Math.floor(Math.random()*100);//0-99
            break;
          case "nw" :
            x = Math.floor(Math.random()*50);//0-49
            y = Math.floor(Math.random()*50);//0-49
            break;
          case "ne" :
            x = Math.floor(Math.random()*50);//0-49
            y = Math.floor(Math.random()*50)+50;//0-49
            break;
          case "sw" :
            x = Math.floor(Math.random()*50);//0-49
            y = Math.floor(Math.random()*50)+50;//50-99
            break;
          case "se" :
            x = Math.floor(Math.random()*50)+50;//50-99
            y = Math.floor(Math.random()*50)+50;//50-99
            break;
        }
      }
      while (!await this.villageService.validateLocation(x,y));

      this.villageService.createVillage(this.villageName, x, y);
      this.alert.clearMessages();
    }
  }
}
