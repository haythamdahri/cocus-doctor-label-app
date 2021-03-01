import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  username: String;

  constructor(private keycloakService: KeycloakService) { }

  ngOnInit(): void { 
    this.username = this.keycloakService.getUsername();
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

}
