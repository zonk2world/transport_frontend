import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AccessRightsService} from '../../services/accessRights.service';
import { CoreService } from '../../services/core.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarStatus: string;

  constructor(protected authService: AuthService,
              private coreService: CoreService,
              public accessRightsService: AccessRightsService,
              protected router: Router) { 
                this.sidebarStatus = 'inactive';
              }

  ngOnInit() {
    this.coreService.toggleSidebar.subscribe(() => {
      this.sidebarStatus = this.sidebarStatus == 'active' ? 'inactive': 'active';
    });
  }

  canView = this.accessRightsService.canView;

}
