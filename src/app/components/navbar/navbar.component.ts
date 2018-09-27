import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public flashMessage: FlashMessagesService,
    public authService: AuthService,
    public router: Router,
    private coreService: CoreService) { }

  ngOnInit() {
  }


  pageReload() {
    window.location.reload();
  }

  onLogoutClick() {
    this.authService.logOut();
    this.flashMessage.show('Logged out', {cssClass: 'alert-success', timeout: 5000});
    this.router.navigate(['login']);
    return false;
  }

  toggleSidebar() {
    this.coreService.toggleSidebar.emit();
  }

}
