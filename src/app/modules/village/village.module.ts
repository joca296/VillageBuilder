import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillageComponent } from 'src/app/components/village/village.component';
import { VillageNavComponent } from 'src/app/components/village-nav/village-nav.component';
import { VillageGoldMineModalComponent } from '../../components/village-gold-mine-modal/village-gold-mine-modal.component';
import { VillageBarracksModalComponent } from '../../components/village-barracks-modal/village-barracks-modal.component';
import { VillageLumberMillModalComponent } from '../../components/village-lumber-mill-modal/village-lumber-mill-modal.component';

@NgModule({
  declarations: [
    VillageComponent,
    VillageNavComponent,
    VillageGoldMineModalComponent,
    VillageBarracksModalComponent,
    VillageLumberMillModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VillageComponent
  ]
})
export class VillageModule { }
