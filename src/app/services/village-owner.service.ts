import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VillageOwnerService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let villageId:string = route.url[2].path;
    if (await this.auth.isAuthenticated() && await this.auth.isVillageOwner(villageId)) {
      return true;
    }
    else {
      this.router.navigate(['game']);
      return false;
    }
  }
}
