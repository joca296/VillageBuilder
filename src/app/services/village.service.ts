import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Village } from '../models/village.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VillageService {

  constructor (
    private firestore:AngularFirestore,
    private storage:AngularFireStorage,
    private auth:AuthService,
    private router: Router) { }

  async createVillage(villageName:string, x:number, y:number) {
    let newVillage:Village = {
      id : Math.random().toString(36).replace('0.', ''),
      x : x,
      y : y,
      name : villageName,
      owner : await this.auth.getUid()
    }

    const villageRef = this.firestore.doc<Village>(`villages/${newVillage.id}`);

    villageRef.set(newVillage);

    await this.auth.addVillage(newVillage.id);
    alert("Village Created");
    this.router.navigate(['game']);
  }

  async validateLocation(x:number, y:number) {
    let result:boolean = true;
    const villages = this.firestore.collection<Village>(`villages`).valueChanges().pipe(take(1)).toPromise();

    await villages.then(villages=> {
      villages.forEach(village => {
        if (village.x == x && village.y == y)
          result = false;
      });
    });

    return result;
  }

  async validateVillageName(villageName:string) {
    let result:boolean = true;
    const villages = this.firestore.collection<Village>(`villages`).valueChanges().pipe(take(1)).toPromise();

    await villages.then(villages=> {
      villages.forEach(village => {
        if (village.name.trim().toLowerCase().localeCompare(villageName.trim().toLowerCase()) == 0)
          result = false;
      });
    });

    return result;
  }

  getVillages () {
    return this.firestore.collection<Village>('villages', ref => ref.orderBy('x','asc').orderBy('y','asc')).valueChanges();
  }
}
