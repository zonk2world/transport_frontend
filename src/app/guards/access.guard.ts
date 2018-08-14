import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';
import {AccessRightsService} from "../services/accessRights.service";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private authService: AuthService,
              private accessRightsService: AccessRightsService,
              private router: Router) {

  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      const loggedInUser: any = this.authService.getLoggedInUser();
      if (!this.accessRightsService.userAccessRights && loggedInUser && loggedInUser.user && loggedInUser.user.site_id) {
        this.accessRightsService.getRightsBySiteIdAndUserId(loggedInUser.user.site_id, loggedInUser.user.id).subscribe((data: any) => {
          this.accessRightsService.userAccessRights = data.rights;
          resolve(true);
        }, err => {
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });
  }
}
