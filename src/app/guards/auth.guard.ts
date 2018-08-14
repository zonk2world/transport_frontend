import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';
import {AccessRightsService} from '../services/accessRights.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private accessRightsService: AccessRightsService,) {

  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.authService.getLoggedInUser()) {
        if (this.authService.loggedIn()) {
          this.authService.getProfile().subscribe(user => {
            this.authService.setLoggedInUser(user);
            const loggedInUser: any = this.authService.getLoggedInUser();
            if (!this.accessRightsService.userAccessRights && loggedInUser && loggedInUser.user && loggedInUser.user.site_id) {
              this.accessRightsService.getRightsBySiteIdAndUserId(loggedInUser.user.site_id, loggedInUser.user.id).subscribe((data: any) => {
                this.accessRightsService.userAccessRights = data.rights;
                resolve(true);
              }, err => {
                resolve(false);
              });
            }
            return resolve(true);
          }, err => {
            this.router.navigate(['login']);
            localStorage.clear();
            resolve(false);
          });
        } else {
          this.router.navigate(['login']);
          localStorage.clear();
          resolve(false);
        }
      } else {
        return resolve(true);
      }
    });
  }
}
