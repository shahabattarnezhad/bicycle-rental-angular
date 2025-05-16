import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLoggedIn = false;

  get imageLogo() {
    return '/assets/images/bicycle.svg';
  }

  login() {
    console.log('Login clicked');
  }

  logout() {
    console.log('Logout clicked');
  }
}
