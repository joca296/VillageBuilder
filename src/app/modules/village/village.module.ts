import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillageComponent } from 'src/app/components/village/village.component';
import { VillageNavComponent } from 'src/app/components/village-nav/village-nav.component';

@NgModule({
  declarations: [
    VillageComponent,
    VillageNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VillageComponent
  ]
})
export class VillageModule { }
