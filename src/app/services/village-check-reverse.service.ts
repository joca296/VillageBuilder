import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VillageCheckReverseService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  async canActivate() {
    if (await this.auth.hasVillage()) {
      this.router.navigate(['game']);
      return false;
    }
    else {
      return true;
    }
  }
}
