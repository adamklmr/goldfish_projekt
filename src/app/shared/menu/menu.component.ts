import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();

  constructor() {
    // console.log("constructor called");
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.checkAdminStatus();
  }

  ngAfterViewInit(): void {
    // console.log("ngAfterViewInit called");
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
  checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.isLoggedIn = loggedIn;
      this.isAdmin = loggedIn && (localStorage.getItem('isAdmin') === 'true');
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }
  checkAdminStatus() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      this.isAdmin = isAdmin === 'true';
    } else {
      this.isAdmin = false;
    }
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = '/home';
    this.closeMenu();
  }
}