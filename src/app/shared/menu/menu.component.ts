import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
  ) {
    // console.log("constructor called");
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
      this.isAdmin = user?.email == "admin@gmail.com" || false;
    });
    
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
    
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    this.authService.signOut();
    window.location.href = '/home';
    this.closeMenu();
  }
}