import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { CreateVillageComponent } from './components/create-village/create-village.component'

import { AngularDraggableModule } from 'angular2-draggable';
import { VillageComponent } from './components/village/village.component';
import { GameModule } from './modules/game/game.module';
import { VillageModule } from './modules/village/village.module';
import { VillageNavComponent } from './components/village-nav/village-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateVillageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameModule,
    VillageModule,
    RouterModule.forRoot([]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularDraggableModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
