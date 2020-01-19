import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from 'src/app/components/game/game.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { GameNavComponent } from '../../components/game-nav/game-nav.component';
import { FormsModule } from '@angular/forms';
import { GameVillageModalComponent } from '../../components/game-village-modal/game-village-modal.component';
import { AlertModule } from '../alert/alert.module';

@NgModule({
  declarations: [
    GameComponent,
    GameNavComponent,
    GameVillageModalComponent
  ],
  imports: [
    CommonModule,
    AngularDraggableModule,
    FormsModule,
    AlertModule
  ],
  exports: [
    GameComponent
  ]
})
export class GameModule { }
