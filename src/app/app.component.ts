import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterLink,
    MenuComponent,
    RouterOutlet,
    MatFormFieldModule,
    FormsModule,
    MatInputModule



  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'goldfish';
  isLoggedIn = false;
  isAdmin = false;
  private authSubscription?: Subscription;
  searchQuery: string = '';
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,   
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUser();
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
      this.isAdmin = user?.email == "admin@gmail.com" || false;
    });
  }

  async loadLoggedInUser(): Promise<void> {
    try {
      this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
      console.log('Current user:', this.currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
  
  // updateAuthStatus(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //     this.isLoggedIn = loggedIn;
  //     this.isAdmin = loggedIn && (localStorage.getItem('isAdmin') === 'true');
  //   } else {
  //     this.isLoggedIn = false;
  //     this.isAdmin = false;
  //   }
    
  // }
  
  logout(): void {
    this.authService.signOut();
  }
  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }
  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Például átirányítás egy keresési oldalra a lekérdezéssel
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
  kereses(query: string): void{
    if(query.trim()){
      this.router.navigate(["/search", query]);
    }
    
  }
}
