import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VillageCheckService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  async canActivate() {
    if (await this.auth.hasVillage()) {
      return true;
    }
    else {
      this.router.navigate(['createVillage']);
      return false;
    }
  }
}
