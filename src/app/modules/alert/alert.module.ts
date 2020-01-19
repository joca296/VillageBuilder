import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    CommonModule
  ]
})
export class AlertModule { }
