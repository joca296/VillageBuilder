import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  async canActivate() {
    if (await this.auth.isAuthenticated()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }
}
