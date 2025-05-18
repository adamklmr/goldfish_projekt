import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../shared/models/User'; // Importáljuk a ProfileObject-et
import { Product } from '../../shared/models/Product';
import { Subscription } from 'rxjs';
import { Event } from '../../shared/models/Event';
import { UserService } from '../../shared/services/user.service';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service'; // Assuming you have an AuthService to get the current user ID

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    RouterLink,
    MatButton
  
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit,OnDestroy {
  user: User | null = null;
  products: Product[] = [];
  events: Event[] = [];
  stats = {
    products: 0,
    events: 0,
  };
  isLoading = true;
  currentUser: any = null;
  
  private subscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService // Assuming you have an AuthService to get the current user ID
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadUserProfile();
    try {
      this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
      console.log('Current user:', this.currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.subscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.products = data.products;
        this.events = data.events;
        this.stats = data.stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  getUserInitials(): string {
    if (!this.user || !this.user.name) return '?';
    
    const firstInitial = this.user.name.firstname ? this.user.name.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = this.user.name.lastname ? this.user.name.lastname.charAt(0).toUpperCase() : '';
    
    return firstInitial + (lastInitial ? lastInitial : '');
  }
  async onDeleteUser(): Promise<void> {
    if (this.user?.email === 'admin@gmail.com') {
      alert('Az adminisztrátor profilja nem törölhető.');
      return;
    }
    try {
      const confirmation = window.confirm('Biztosan törölni szeretné a felhasználót?');
      if (!confirmation) {
        return;
      }

      // await this.userService.deleteUser(this.currentUser);
      await this.authService.deleteUser(this.currentUser);
      console.log('Felhasználó sikeresen törölve.');
      this.authService.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.log(this.currentUser)
      console.error('Hiba a felhasználó törlése során:', error);
    }
  }
  logout(): void {
    this.authService.signOut();
  }
}