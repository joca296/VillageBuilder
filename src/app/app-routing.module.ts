import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { LoginCheckService } from './services/login-check.service';
import { VillageCheckService } from './services/village-check.service';
import { CreateVillageComponent } from './components/create-village/create-village.component';
import { VillageCheckReverseService } from './services/village-check-reverse.service';
import { VillageComponent } from './components/village/village.component';
import { VillageOwnerService } from './services/village-owner.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'game' , component: GameComponent, canActivate: [VillageCheckService]},
  { path: 'game/village/:id' , component: VillageComponent, canActivate: [VillageOwnerService]},
  { path: 'createVillage' , component: CreateVillageComponent, canActivate: [VillageCheckReverseService]},
  { path: '**', redirectTo: "/" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
