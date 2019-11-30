import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillageComponent } from 'src/app/components/village/village.component';

@NgModule({
  declarations: [
    VillageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VillageComponent
  ]
})
export class VillageModule { }
